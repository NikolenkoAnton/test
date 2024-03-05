import { Request } from 'express';
import { Body, Get, Post, Req } from 'routing-controllers';
import pkg, { WhereOptions } from 'sequelize';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { getMarkets, getTemplates, saveMarket, searchMarkets } from '../../swagger/operations/template';
import config from '../config';
import sequelize from '../db';
import {
  MarketGroup,
  Outcome,
  MarketGroupSs,
  Sport,
  TemplateView,
  TemplateViewColumn,
  TemplateViewMarket,
  TemplateViewOutcome,
  UserLog,
} from '../db/models';
import {
  GetMarketsDto,
  GetMarketsResponse,
  GetMarketsResponseDto,
  GetTemplatesResponseDto,
  hasTemplateValues,
  SearchMarketsDto,
  SearchMarketsResponse,
  SearchMarketsResponseDto,
  SuccessStatusResponse,
  UpdateMarketDto,
} from '../dto';
import { USER_LOG_ACTIONS } from '../helper/constants';
import { DefaultController } from '../helper/custom-controller.decorator';
import { ServerError } from '../helper/errors';
import { log } from '../helper/sentry';

const { Op, where: sequelizeWhere, cast, col } = pkg;

@DefaultController('/template', 'Template')
export class TemplateController {
  @ApiOperationPost(getMarkets)
  @Post('markets')
  async getMarkets(@Body() body: GetMarketsDto): Promise<GetMarketsResponseDto> {
    const perPage = body.per_page || config.DEFAULT_PAGINATION_SIZE;
    const page = !body.page || body.page < 1 ? 1 : body.page;

    const where: WhereOptions = {
      [Op.and]: [],
    };
    if (!body.market_group_id) {
      if (body.sport_id) {
        where['sport_id'] = body.sport_id;
      }
      if (body.has_template) {
        where[`$templateViewMarket.id$`] = {
          [body.has_template === hasTemplateValues.YES ? Op.ne : Op.eq]: null,
        };
      }
      if (body.market_name) {
        where['type'] = {
          [Op.iLike]: `%${body.market_name}%`,
        };
      }
      if (body.br_id) {
        where[Op.and].push(
          sequelizeWhere(cast(col('MarketGroup.provider_market_group_id'), 'text'), { [Op.iLike]: `%${body.br_id}%` }),
        );
      }
    } else if (body.market_group_id) {
      where['id'] = body.market_group_id;
    }

    const count = await MarketGroup.count({
      include: [
        {
          model: TemplateViewMarket
        },
        {
          model: Sport,
          required: true
        },
      ],
      where,
    });

    const marketGroups: MarketGroup[] = await MarketGroup.findAll({
      include: [
        {
          model: TemplateViewMarket,
          include: [
            {
              model: TemplateView,
              attributes: [
                ['name', 'template_view_name'],
                ['id', 'template_view_id'],
              ],
            },
          ],
          attributes: ['id'],
        },
        {
          model: Sport,
          required: true
        },
      ],
      where,
      limit: perPage,
      offset: (page - 1) * perPage,
      attributes: ['id', 'provider_market_group_id', ['type', 'name']],
      order: ['provider_market_group_id'],
      raw: true,
      nest: true,
    });

    if (!marketGroups.length) {
      return {
        rows: [],
        pages: 0,
        current_page: 0,
      };
    }

    let rows: GetMarketsResponse[] = marketGroups.map((marketGroup: any) => {
      return {
        id: marketGroup.id,
        sport_name: marketGroup.sport.en,
        sport_id: marketGroup.sport.id,
        provider_market_group_id: marketGroup.provider_market_group_id,
        name: marketGroup.name,
        template_view_name: marketGroup.templateViewMarket.templateView.template_view_name,
        template_view_id: marketGroup.templateViewMarket.templateView.template_view_id,
      };
    });
    const marketIds = rows.map((market) => market.id);
    let outcomes: any = await Outcome.findAll({
      include: {
        model: TemplateViewOutcome,
        attributes: [['template_view_column_id', 'column_id'], 'name'],
      },
      where: {
        market_group_id: {
          [Op.in]: marketIds,
        },
      },
      attributes: ['id', 'type', 'market_group_id'],
      order: ['id'],
      raw: true,
      nest: true,
    });

    outcomes = outcomes.map((outcome) => {
      return {
        id: outcome.id,
        type: outcome.type,
        market_group_id: outcome.market_group_id,
        name: outcome.templateViewOutcomes.name,
        column_id: outcome.templateViewOutcomes.column_id,
      };
    });

    rows = rows.map((marketGroup: any) => {
      marketGroup.column = outcomes.filter((outcome) => {
        return outcome.market_group_id.toString() === marketGroup.id.toString();
      });
      return marketGroup;
    });

    return {
      rows,
      pages: Math.ceil(count / perPage),
      current_page: page,
    };
  }

  @ApiOperationPost(searchMarkets)
  @Post('markets/search')
  async searchMarkets(@Body() body: SearchMarketsDto): Promise<SearchMarketsResponseDto> {
    const where: WhereOptions = {
      [Op.or]: [],
    };

    if (body.search) {
      const searchQuery = `%${body.search}%`;
      const regex = /\"(.*)\"/;
      const regExec = regex.exec(body.search);
      if (regExec !== null) {
        where[Op.or].push({
          name: regExec[1],
        });
      } else {
        where[Op.or].push({
          name: {
            [Op.iLike]: searchQuery,
          },
        });
      }
      where[Op.or].push(sequelizeWhere(cast(col('ss_id'), 'text'), { [Op.iLike]: searchQuery }));
    } else {
      delete where[Op.or];
    }

    const marketGroups: MarketGroupSs[] = await MarketGroupSs.findAll({
      attributes: [[pkg.fn('count', col('ss_id')), 'ss_ids'], 'name'],
      where,
      group: 'name',
      order: [[pkg.fn('length', col('name')), 'ASC']],
      limit: 50,
      raw: true,
    });

    if (!marketGroups.length) {
      return {
        rows: [],
      };
    }

    const rows: SearchMarketsResponse[] = marketGroups.map((marketGroup: any) => {
      return {
        name: marketGroup.name,
      };
    });

    return {
      rows,
    };
  }

  @ApiOperationGet(getTemplates)
  @Get('templates')
  async getTemplates(): Promise<GetTemplatesResponseDto> {
    const templateViews: any = await TemplateView.findAll({
      include: {
        model: TemplateViewColumn,
        required: true,
        attributes: [
          ['id', 'column_id'],
          ['name', 'column_name'],
        ],
      },
      attributes: ['id', 'name'],
      order: [
        'id',
        ['templateViewColumns', 'position'], // TemplateViewColumn references with {as: 'templateViewColumns'}
      ],
      raw: true,
      nest: true,
    });

    const templates: GetTemplatesResponseDto = {};
    for (const templateView of templateViews) {
      if (!templates[templateView.id]) {
        templates[templateView.id] = {
          id: templateView.id,
          name: templateView.name,
          column: [],
        };
      }
      if (templateView.templateViewColumns) {
        templates[templateView.id].column.push({
          id: templateView.templateViewColumns.column_id,
          name: templateView.templateViewColumns.column_name,
        });
      }
    }

    return templates;
  }

  @ApiOperationPost(saveMarket)
  @Post('markets/save')
  async saveMarket(@Req() req: Request, @Body() body: UpdateMarketDto): Promise<SuccessStatusResponse> {
    const t = await sequelize.transaction();
    try {
      if (!body.template_id) {
        await TemplateViewMarket.destroy({ where: { market_group_id: body.id }, transaction: t });
        await UserLog.add(USER_LOG_ACTIONS.TEMPLATE_VIEW_MARKET_DELETE, req, t);
      } else {
        const exists: TemplateViewMarket = await TemplateViewMarket.findOne({
          where: {
            market_group_id: body.id,
          },
        });

        if (exists) {
          await exists.update(
            {
              template_view_id: body.template_id,
            },
            { transaction: t },
          );
          await UserLog.add(USER_LOG_ACTIONS.TEMPLATE_VIEW_MARKET_UPDATE, req);
        } else {
          await TemplateViewMarket.create(
            {
              market_group_id: body.id,
              template_view_id: body.template_id,
            },
            { transaction: t },
          );
          await UserLog.add(USER_LOG_ACTIONS.TEMPLATE_VIEW_MARKET_CREATE, req, t);
        }
      }

      body.column = JSON.parse(body.column);
      const keys = Object.keys(body.column);
      for (const key of keys) {
        if (body.column[key] && body.column[key].id === null) {
          await TemplateViewOutcome.destroy({
            where: {
              outcome_id: key,
            },
            transaction: t,
          });
        } else {
          const exists: TemplateViewOutcome = await TemplateViewOutcome.findOne({
            where: {
              outcome_id: key,
            },
          });

          if (exists) {
            await exists.update(
              {
                template_view_column_id: body.column[key].id,
                name:
                  body.column[key].name && body.column[key].name?.trim() !== '' ? body.column[key].name.trim() : null,
              },
              { transaction: t },
            );
          } else {
            await TemplateViewOutcome.create(
              {
                outcome_id: key,
                template_view_column_id: body.column[key].id,
                name:
                  body.column[key].name && body.column[key].name?.trim() !== '' ? body.column[key].name.trim() : null,
              },
              { transaction: t },
            );
          }
        }
      }
      await t.commit();
      return { message: 'OK' };
    } catch (err) {
      await t.rollback();
      log(err);
      throw new ServerError('Localization key update failed');
    }
  }
}
