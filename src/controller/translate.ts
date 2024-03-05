import { Request } from 'express';
import lodash from 'lodash';
import { Body, Get, Post, Req } from 'routing-controllers';
import { Op, WhereOptions } from 'sequelize';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import {
  deleteTranslateKey,
  getTranslateKeyValues,
  getTranslateKeys,
  getTranslateKeysGroups,
  saveTranslateKey,
} from '../../swagger/operations/translate';
import config from '../config';
import sequelize from '../db';
import { SiteDomain, TranslateKey, TranslateKeyValue, TranslateLanguage, UserLog } from '../db/models';
import {
  DeleteTranslateKeyDto,
  GetTranslateKeyValuesDto,
  GetTranslateKeysDto,
  GetTranslateKeysGroupsResponseDto,
  GetTranslateKeysResponseDto,
  SaveTranslateKeyDto,
  SuccessStatusResponse,
} from '../dto';
import { TranslateKeyResponse } from '../dto/response/translate';
import { USER_LOG_ACTIONS } from '../helper/constants';
import { DefaultController } from '../helper/custom-controller.decorator';
import { BadRequestError, NotFoundError, ServerError } from '../helper/errors';
import { log } from '../helper/sentry';
const { pick, map, assign } = lodash;

@DefaultController('/translate', 'Translate')
export class TranslateController {
  @ApiOperationPost(getTranslateKeys)
  @Post('keys')
  async getTranslateKeys(@Body() body: GetTranslateKeysDto): Promise<GetTranslateKeysResponseDto> {
    const page = body.page || 1;
    const perPage = body.per_page || config.DEFAULT_PAGINATION_SIZE;

    const where: WhereOptions = {};

    if (body.search) {
      where.key = {
        [Op.like]: `%${body.search}%`,
      };
    }

    if (body.groups?.length) {
      where.group = {
        [Op.in]: body.groups,
      };
    }

    const count = await TranslateKey.count({ where });
    const translateKeysWithValues = await TranslateKey.findAll({
      where,
      include: {
        model: TranslateKeyValue,
        include: [
          { model: SiteDomain },
          {
            model: TranslateLanguage,
            where: {
              active: 1,
            },
            required: false,
          },
        ],
      },
      order: [['key', 'ASC']],
      limit: perPage,
      offset: (page - 1) * perPage,
      raw: true,
      nest: true,
    });

    const rows: TranslateKeyResponse[] = translateKeysWithValues.reduce((prev: TranslateKeyResponse[], curr: any) => {
      const arrEntry = prev.find((x) => x.id === curr.id);
      if (!arrEntry) {
        return prev.concat({
          id: curr.id,
          key: curr.key,
          group: curr.group,
          description: curr.description,
          languages: [curr.translateKeyValues.language.short],
          text_values: [curr.translateKeyValues],
        });
      }
      arrEntry.languages.push(curr.translateKeyValues.language.short);
      arrEntry.text_values.push(curr.translateKeyValues);
      return prev;
    }, []);

    return {
      rows,
      pages: Math.ceil(count / perPage),
      current_page: page,
    };
  }

  @ApiOperationGet(getTranslateKeysGroups)
  @Get('keys/groups')
  async getTranslateKeysGroups(): Promise<GetTranslateKeysGroupsResponseDto> {
    const groups = await TranslateKey.findAll({
      group: 'group',
      attributes: ['group'],
    });

    return {
      rows: groups.map((gr) => gr.group),
    };
  }

  @ApiOperationPost(getTranslateKeyValues)
  @Post('key/values')
  async getTranslateKeyValues(@Body() body: GetTranslateKeyValuesDto) {
    const translateKey = await TranslateKey.findByPk(body.key_id);
    if (!translateKey) {
      throw new NotFoundError('Key is not found');
    }

    const values = await TranslateKeyValue.findAll({
      where: { translate_key_id: body.key_id },
      include: [{ model: TranslateLanguage.scope('main') }, { model: SiteDomain.scope('main') }],
    });

    return {
      key_id: translateKey.id,
      values,
    };
  }

  @ApiOperationPost(saveTranslateKey)
  @Post('keys/save')
  async saveTranslateKey(@Req() req: Request, @Body() body: SaveTranslateKeyDto): Promise<SuccessStatusResponse> {
    const where: WhereOptions = {
      key: {
        [Op.iLike]: body.key,
      },
    };

    if (body.id) {
      where['id'] = {
        [Op.not]: body.id,
      };
    }

    const isTranslatedKeyExists = await TranslateKey.findOne({ where });

    if (isTranslatedKeyExists) {
      throw new BadRequestError('Key is already exists!');
    }
    try {
      let translateKey: TranslateKey;
      if (body.id) {
        translateKey = await TranslateKey.findByPk(body.id);
        if (!translateKey) {
          throw new NotFoundError('TranslateKey not found');
        }
        translateKey.update({
          key: body.key,
          group: body.key.includes('.') ? body.key.split('.')[0] : null,
          description: body.description,
        });
        await UserLog.add(USER_LOG_ACTIONS.TRANSLATE_KEY_UPDATE, req);
      } else {
        translateKey = await TranslateKey.create({
          key: body.key,
          group: body.key.includes('.') ? body.key.split('.')[0] : null,
          description: body.description,
        });
        await UserLog.add(USER_LOG_ACTIONS.TRANSLATE_KEY_CREATE, req);
      }

      await TranslateKeyValue.destroy({
        where: {
          translate_key_id: translateKey.id,
        },
      });

      await TranslateKeyValue.bulkCreate(map(body.values, (val) => ({ ...val, translate_key_id: translateKey.id })));

      return { message: 'OK' };
    } catch (e) {
      log(e);
      throw new ServerError('Localization key update failed');
    }
  }

  @ApiOperationPost(deleteTranslateKey)
  @Post('keys/delete')
  async deleteTranslateKey(@Req() req: Request, @Body() body: DeleteTranslateKeyDto): Promise<SuccessStatusResponse> {
    const translateKey = await TranslateKey.findByPk(body.id);

    if (!translateKey) {
      return { message: 'OK' };
    }

    const translateKeyValues = await translateKey.getTranslateKeyValues();

    const t = await sequelize.transaction();
    try {
      await TranslateKeyValue.destroy({
        where: {
          id: {
            [Op.in]: translateKeyValues.map((tkv) => tkv.id),
          },
          translate_key_id: translateKey.id,
        },
        transaction: t,
      });
      await TranslateKey.destroy({
        where: {
          id: translateKey.id,
        },
        transaction: t,
      });
      await UserLog.add(USER_LOG_ACTIONS.TRANSLATE_KEY_DELETE, req, t);

      await t.commit();
    } catch (err) {
      log(err);
      await t.rollback();
      throw new ServerError('Localization key deletion failed');
    }

    return { message: 'OK' };
  }
}
