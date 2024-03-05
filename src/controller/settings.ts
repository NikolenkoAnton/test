import { Request } from 'express';
import { Body, Delete, Get, Post, Put, QueryParams, Req, UseBefore } from 'routing-controllers';
import { ApiOperationDelete, ApiOperationGet, ApiOperationPost, ApiOperationPut } from 'swagger-express-ts';
import { Inject } from 'typedi';
import { addDomain, getDomains, removeDomain, saveDomain } from '../../swagger/operations/settings';
import sequelize from '../db';
import { UserLog } from '../db/models';
import SiteDomain from '../db/models/SiteDomain';
import {
  DEFAULT_SUCCESS_RESPONSE,
  GetDomainsResponseDto,
  QueryWithId,
  SaveSiteDomainDto,
  SuccessStatusResponse,
  AddSiteDomainDto,
} from '../dto';
import { USER_LOG_ACTIONS } from '../helper/constants';
import { DefaultController } from '../helper/custom-controller.decorator';
import { SaveError, ServerError } from '../helper/errors';
import { log } from '../helper/sentry';
import { SettingsService } from '../service/settings.service';
import { configureDomainMulter } from '../helper/settings';

@DefaultController('/settings', 'Settings')
export class SettingsController {
  @Inject()
  settingsService: SettingsService;

  @ApiOperationPut(saveDomain)
  @Put('domain/save')
  @UseBefore(configureDomainMulter())
  async saveSiteDomain(@Req() req: Request, @Body() body: SaveSiteDomainDto): Promise<SiteDomain | null> {
    let result;
    const files = this.settingsService.domainImageProcess(req);

    if (!body.active && body.is_default) {
      throw new SaveError('Default domain cannot be inactive');
    }

    const transaction = await sequelize.transaction();
    try {
      result = await this.settingsService.updateSiteDomain(body.id, body, files, transaction);
      await UserLog.add(USER_LOG_ACTIONS.SITE_DOMAIN_UPDATE, req, transaction);
      await transaction.commit();
    } catch (err) {
      log(err);
      await transaction.rollback();
      throw err;
    }

    return result;
  }

  @ApiOperationPost(addDomain)
  @Post('domain/add')
  @UseBefore(configureDomainMulter())
  async createSiteDomain(@Req() req: Request, @Body() body: AddSiteDomainDto): Promise<SiteDomain | null> {
    let result;
    const files = this.settingsService.domainImageProcess(req);

    if (!body.active && body.is_default) {
      throw new SaveError('Default domain cannot be inactive');
    }

    const transaction = await sequelize.transaction();
    try {
      result = await this.settingsService.createSiteDomain(body, files, transaction);
      await UserLog.add(USER_LOG_ACTIONS.SITE_DOMAIN_CREATE, req, transaction);
      await transaction.commit();
    } catch (err) {
      log(err);
      await transaction.rollback();
      throw err;
    }

    return result;
  }

  @ApiOperationGet(getDomains)
  @Get('domain')
  async getSiteDomain(): Promise<GetDomainsResponseDto> {
    const data = await this.settingsService.getSiteDomains();

    return { rows: data };
  }

  @ApiOperationDelete(removeDomain)
  @Delete('domain/delete')
  async removeSiteDomain(@QueryParams() data: QueryWithId, @Req() req: Request): Promise<SuccessStatusResponse> {
    const id = data.id;

    await this.settingsService.checkDomainOnDelete(id);

    const transaction = await sequelize.transaction();
    try {
      await this.settingsService.removeSiteDomainById(id, transaction);
      await UserLog.add(USER_LOG_ACTIONS.SITE_DOMAIN_DELETE, req, transaction);
      await transaction.commit();
    } catch (err) {
      log(err);
      await transaction.rollback();
      throw new ServerError('Domain delete failed');
    }

    return DEFAULT_SUCCESS_RESPONSE;
  }
}
