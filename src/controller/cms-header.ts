import { Sequelize } from 'sequelize-typescript';
import { Request } from 'express';
import lodash, { difference, find, intersection, map, sortBy, uniqBy } from 'lodash';
import { BadRequestError, Body, Get, Post, Req } from 'routing-controllers';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { Inject } from 'typedi';
import {
  getCmsHeaderBlocks,
  updateCmsHeaderBlocks,
  updateCmsHeaderBlockText,
} from '../../swagger/operations/cms-header';
import sequelize from '../db';
import { CmsHeaderBlock, CmsHeaderBlockValue, SiteDomain, TranslateLanguage, UserLog } from '../db/models';
import { BulkUpdate } from '../db/models/Base';
import { CmsHeaderBlockRequest } from '../dto';
import { PatchActiveAndPositionDto } from '../dto';
import { CMS_HEADER_BLOCK_TYPES_ENUM, USER_LOG_ACTIONS } from '../helper/constants';
import { DefaultController } from '../helper/custom-controller.decorator';
import { ServerError } from '../helper/errors';
import { log } from '../helper/sentry';
import { SettingsService } from '../service/settings.service';
import { Op } from 'sequelize';
const { pick } = lodash;

@DefaultController('/cms-header', 'CmsHeader')
export class CmsHeaderController {
  @Inject()
  private readonly settingsService: SettingsService;

  @ApiOperationGet(getCmsHeaderBlocks)
  @Get('blocks')
  async getBlocks() {
    const headers = await CmsHeaderBlock.scope('sorted').findAll({
      include: [{ model: CmsHeaderBlockValue, include: [{ model: SiteDomain }, { model: TranslateLanguage }] }],
    });

    return await Promise.all(
      headers.map(async (record) => {
        const textValue = await this.settingsService.getDefaultValue<CmsHeaderBlockValue>(
          {
            cms_header_block_id: record.id,
          },
          CmsHeaderBlockValue,
        );

        record.title = textValue?.title;

        return record.toJSON();
      }),
    );
  }

  @ApiOperationPost(updateCmsHeaderBlockText)
  @Post('blocks/text-update')
  async updateBlockText(@Body() body: CmsHeaderBlockRequest, @Req() req: Request) {
    try {
      await sequelize.transaction(async (transaction) => {
        const defaultSettings = await this.settingsService.getDefaultSettings();

        const newDefaultValue = body.values.find(
          (value) =>
            value.language_id === defaultSettings.language_id && value.site_domain_id === defaultSettings.site_domain_id,
        );

        if (!newDefaultValue) {
          throw new BadRequestError('You must send default value!');
        }

        await CmsHeaderBlockValue.destroy({
          where: { cms_header_block_id: body.id },
          transaction,
        });

        await Promise.all(
          body.values.map((blockValue) =>
            CmsHeaderBlockValue.create(
              {
                ...pick(blockValue, 'site_domain_id', 'language_id', 'title'),
                cms_header_block_id: body.id,
              },
              { transaction },
            ),
          ),
        );
        await UserLog.add(USER_LOG_ACTIONS.CMS_HEADER_BLOCK_UPDATE, req, transaction);
      });
    } catch (err) {
      log(err);
      throw new ServerError();
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(updateCmsHeaderBlocks)
  @Post('blocks/update')
  async blocksUpdate(@Body() body: PatchActiveAndPositionDto, @Req() req: Request) {
    const headersFromRequest = sortBy(body.data, 'position');

    try {
      await sequelize.transaction(async (transaction) => {
        const headers = await CmsHeaderBlock.scope('sorted').findAll();

        if (difference(map(headers, 'id'), map(headersFromRequest, 'id')).length) {
          throw new BadRequestError('You must send all blocks!');
        }

        if (uniqBy(headersFromRequest, 'position').length !== headersFromRequest.length) {
          throw new BadRequestError('Incorrect blocks position!');
        }

        await BulkUpdate(CmsHeaderBlock, headersFromRequest, ['active', 'position', 'target_blank'], transaction);

        await UserLog.add(USER_LOG_ACTIONS.CMS_HEADER_BLOCK_UPDATE, req, transaction);
      });
    } catch (err) {
      if (err.httpCode < 500) {
        throw err;
      } else {
        log(err);
        throw new ServerError();
      }
    }

    return { message: 'OK' };
  }
}
