import { Request, Response } from 'express';
import { assign, castArray, head, map } from 'lodash';
import { Body, Delete, Get, Post, QueryParams, Req, Res } from 'routing-controllers';
import { col, fn, Includeable, literal, Op, where } from 'sequelize';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { Inject } from 'typedi';
import {
  deleteBetHistoryPresets,
  getBetHistoryPresets,
  getBets,
  getBetTableColumns,
  saveBetHistoryPresets,
} from '../../../swagger/operations/bet';
import { Bet, BetAttributes, BetHistoryPreset, BetOutcome, PlatformUser, User, UserLog } from '../../db/models';
import { BulkUpsert } from '../../db/models/Base';
import BetOutcomeAttributes from '../../db/models/BetOutcomeAttributes';
import { QueryWithId } from '../../dto/shared';
import { BET_HISTORY_TABLE_COLUMNS_ENUM, USER_LOG_ACTIONS } from '../../helper/constants';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { generateXmlFile } from '../../helper/generate-xml';
import { UserFromRequest } from '../../helper/user.parameter.decorator';
import { buildWhereCondition } from '../../helper/where-interval.util';
import { GetBetsDto } from './bet.request';
import { BetResponse, BetTableColumnsResponse } from './bet.response';
import { BetService } from './bet.service';

@DefaultController('/bet', 'Bet')
export class BetController {
  @Inject()
  private betService: BetService;

  @ApiOperationGet(getBetTableColumns)
  @Get('config/columns')
  async getBetTableColumns(): Promise<BetTableColumnsResponse> {
    return { columns: Object.values(BET_HISTORY_TABLE_COLUMNS_ENUM) };
  }

  @ApiOperationDelete(deleteBetHistoryPresets)
  @Delete('config/presets/delete')
  async deleteBetHistoryPresets(@QueryParams() data: QueryWithId, @Req() req: Request) {
    await BetHistoryPreset.destroy({ where: { id: data.id } });
    await UserLog.add(USER_LOG_ACTIONS.BET_HISTORY_FILTER_PRESET_DELETE, req);
    return true;
  }

  @ApiOperationPost(saveBetHistoryPresets)
  @Post('config/presets/save')
  async saveBetHistoryPresets(@UserFromRequest() user: User, @Body() data, @Req() req: Request) {
    await BulkUpsert(BetHistoryPreset, [{ ...data, user_id: user.id }]);
    await UserLog.add(USER_LOG_ACTIONS.BET_HISTORY_FILTER_PRESET_CREATE, req);

    return this.getBetHistoryPresets(user);
  }

  @ApiOperationGet(getBetHistoryPresets)
  @Get('config/presets')
  async getBetHistoryPresets(@UserFromRequest() user: User) {
    return BetHistoryPreset.findAll({ where: { user_id: user.id } });
  }

  @ApiOperationPost(getBets)
  @Post('bets')
  async getBetsHistory(
    @Body() body: GetBetsDto,
    @UserFromRequest() user: User,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { per_page, page } = body;

    const innerFiltersNotUsed = !body.platform_id && !body.cashdesk_id && !body.id && !body.market;

    const betOutcomeOption: Includeable = {
      model: BetOutcome,
      attributes: ['id'],
      where: {},
      include: [
        {
          model: BetOutcomeAttributes,
          attributes: ['id'],
        },
      ],
    };

    const options: any = {
      subQuery: innerFiltersNotUsed,
      order: [['created_at', body.order || 'DESC']],
      attributes: ['id', 'system'],
      include: [
        {
          model: BetAttributes,
          attributes: ['id'],
        },
        betOutcomeOption,
        {
          model: PlatformUser,
          attributes: ['id', 'user_id'],
        },
      ],
    };

    options.where = {
      user_id: {
        [Op.not]: null,
      },
    };

    const andQuery = [];
    const updatedOptions = this.betService.chooseColumns(options, body.columns);
    // #region
    if (body.bet_result) {
      const betResult = buildWhereCondition(body?.bet_result, 'resulted_at');

      assign(updatedOptions.where, betResult);
    }
    if (body.bet_placement) {
      const betPlacement = buildWhereCondition(body?.bet_placement, 'created_at');
      assign(updatedOptions.where, betPlacement);
    }

    const thisSetConditions = {};

    if (body.sport_id) {
      thisSetConditions['$betOutcomes.betOutcomeAttributes.sport_id$'] = {
        [Op.in]: castArray(body.sport_id),
      };
    }
    if (body.category_id) {
      thisSetConditions['$betOutcomes.betOutcomeAttributes.category_id$'] = {
        [Op.in]: castArray(body.category_id),
      };
    }
    if (body.competition_id) {
      thisSetConditions['$betOutcomes.betOutcomeAttributes.competition_id$'] = {
        [Op.in]: castArray(body.competition_id),
      };
    }
    if (body.game_id) {
      thisSetConditions['$betOutcomes.game_id$'] = {
        [Op.in]: castArray(body.game_id),
      };
    }
    if (Object.values(thisSetConditions).length) {
      andQuery.push(thisSetConditions);
    }

    if (body.customer_id) {
      updatedOptions.where['user_id'] = {
        [Op.in]: castArray(body.customer_id),
      };
    }

    if (body.platform_id) {
      updatedOptions.where['$platformUser.platform_id$'] = {
        [Op.in]: castArray(body.platform_id),
      };
    }

    if (body.platform_user_id) {
      updatedOptions.where['$platformUser.user_id$'] = {
        [Op.in]: castArray(body.platform_user_id),
      };
    }

    if (body.bonus_filters?.length) {
      andQuery.push(where(fn('COALESCE', col(`betAttributes.bonus_type`), 'empty'), { [Op.in]: body.bonus_filters }));
    }

    const cashout_statement = head(body.cashout);
    if (cashout_statement) {
      const operand = cashout_statement === 'cashout' ? '>' : '=';
      const cashoutQuery = where(literal(`"Bet"."cashout_amount"`), operand, 0);
      andQuery.push(cashoutQuery);
    }
    if (body.id) {
      updatedOptions.where['id'] = {
        [Op.in]: castArray(body.id),
      };
    }
    if (body.market) {
      updatedOptions.where['$betOutcomes->betOutcomeAttributes.market_name$'] = {
        [Op.in]: castArray(body.market),
      };
    }

    const stakeStatement = [];

    const stakeSubQuery = literal(`("Bet"."stake"/"Bet"."currency_value")`);

    if (body.min_stake) {
      stakeStatement.push(where(stakeSubQuery, '>=', body.min_stake));
    }

    if (body.max_stake) {
      stakeStatement.push(where(stakeSubQuery, '<=', body.max_stake));
    }

    if (stakeStatement.length) {
      andQuery.push({
        [Op.and]: stakeStatement,
      });
    }

    const riskStatement = [];

    const riskSubQuery = literal(
      `CASE WHEN "Bet"."result" IS NOT NULL THEN 0
       ELSE ("Bet"."possible_win"-"Bet"."stake")/"Bet"."currency_value"
       END`,
    );
    if (body.min_risks) {
      riskStatement.push(where(riskSubQuery, '>=', body.min_risks));
    }

    if (body.max_risks) {
      riskStatement.push(where(riskSubQuery, '<=', body.max_risks));
    }

    if (riskStatement.length) {
      andQuery.push({
        [Op.and]: riskStatement,
      });
    }

    if (body.bet_types?.length) {
      updatedOptions.where['type'] = {
        [Op.in]: body.bet_types,
      };
    }

    if (body.bet_results?.length) {
      updatedOptions.where['result'] = {
        [Op.or]: [{ [Op.in]: body.bet_results }],
      };

      if (body.bet_results.includes('in_progress')) {
        updatedOptions.where['result'][Op.or].push({ [Op.is]: null });
      }
    }

    if (body.bet_sections?.length) {
      updatedOptions.where['$betOutcomes.section$'] = {
        [Op.in]: body.bet_sections,
      };

      assign(betOutcomeOption.where, { section: { [Op.in]: body.bet_sections } });
    }

    updatedOptions.where[Op.and] = andQuery;
    // #endregion
    const countRows = await Bet.findAll({
      ...updatedOptions,

      subQuery: false,
      attributes: {
        include: ['id'],
        exclude: [
          'uuid',
          'user_id',
          'ticket_id',
          'bet_slip_id',
          'closed',
          'code',
          'number',
          'pending',
          'stake',
          'freebet',
          'stake_real',
          'stake_bonus',
          'odds',
          'win',
          'possible_win',
          'system',
          'type',
          'currency_code',
          'currency_value',
          'comment',
          'proceed_after',
          'resulted_at',
          'created_at',
          'updated_at',
        ],
      },
    });

    const count = countRows.length;

    const bets =
      count > 0
        ? await Bet.findAll({
            ...updatedOptions,
            where: {
              id: {
                [Op.in]: map(countRows, 'id').splice((page - 1) * per_page, per_page),
              },
            },
            order: [['created_at', body.order || 'DESC']],
          })
        : [];

    const rows = map(bets, (bet) => new BetResponse(bet.toJSON(), body.columns));

    if (body.generate_file) {
      res.setHeader('content-type', 'application/xml');

      await UserLog.add(USER_LOG_ACTIONS.GENERATE_BET_HISTORY_XML_FILE, req);
      return generateXmlFile(rows).pipe(res);
    } else
      return {
        rows,
        pages: Math.ceil(count / per_page),
        current_page: page,
      };
  }
}
