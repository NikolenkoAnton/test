import { DefaultController } from '../helper/custom-controller.decorator';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import { Body, Get, Post, QueryParams, Req } from 'routing-controllers';
import { Inject } from 'typedi';
import {
  GetRmtCategoryBySport,
  GetRmtCompetitionBySport,
  GetRmtMarketDto,
  GetRmtSportByCompetitionDto,
  GetRmtSportDto,
  GetRmtTeamDto,
  SaveRmtBaseSettingsDto,
  SaveRmtMarketDto,
  SaveRmtPlayerDto,
  SaveRmtPlayerRtpDto,
  SaveRmtSportByCompetitionDto,
  SaveRmtTeamDto,
} from '../dto/rmt';
import { SaveError, ServerError } from '../helper/errors';
import { log } from '../helper/sentry';
import {
  DEFAULT_SUCCESS_RESPONSE,
  GetRmtCategoryResponseDto,
  GetRmtCompetitionResponseDto,
  GetRmtMarketResponseDto,
  GetRmtSportByCategoryResponseDto,
  GetRmtSportResponseDto,
  GetRmtTeamResponseDto,
  QueryWithId,
} from '../dto';
import {
  getRmtBaseSettings,
  getRmtCategory,
  getRmtCompetition,
  getRmtMarket,
  getRmtPlayer,
  getRmtPlayerRtp,
  getRmtSport,
  getRmtSportByCompetition,
  getRmtTeam,
  saveRmtBaseSettings,
  saveRmtMarket,
  saveRmtPlayer,
  saveRmtPlayerRtp,
  saveRmtSport,
  saveRmtTeam,
} from '../../swagger/operations/rmt';
import { SuccessStatusResponse } from '../dto';
import { RmtService } from '../service/rmt';
import sequelize from '../db';
import RMTBaseSettings from '../db/models/RMTBaseSettings';
import { UserLog } from '../db/models';
import { USER_LOG_ACTIONS } from '../helper/constants';
import { Request } from 'express';

@DefaultController('/rmt', 'Rmt')
export class RmtController {
  @Inject()
  private readonly rmtService: RmtService;

  @ApiOperationGet(getRmtMarket)
  @Get('market')
  async getRmtMarkets(@QueryParams() body: GetRmtMarketDto): Promise<GetRmtMarketResponseDto> {
    try {
      const results = await this.rmtService.getRmtMarkets(body);
      return results;
    } catch (err) {
      log(err);
      throw new ServerError();
    }
  }

  @ApiOperationPost(saveRmtMarket)
  @Post('market/save')
  async saveRmtMarket(@Body() body: SaveRmtMarketDto, @Req() req: Request): Promise<SuccessStatusResponse> {
    const transaction = await sequelize.transaction();
    try {
      await this.rmtService.saveRmtMarket(body, transaction);

      await UserLog.add(USER_LOG_ACTIONS.SAVE_RMT_MARKET, req, transaction);

      await transaction.commit();
      return DEFAULT_SUCCESS_RESPONSE;
    } catch (err) {
      await transaction.rollback();
      log(err);
      throw new ServerError();
    }
  }

  @ApiOperationGet(getRmtSport)
  @Get('event')
  async getRmtSports(@QueryParams() body: GetRmtSportDto): Promise<GetRmtSportResponseDto> {
    try {
      const results = await this.rmtService.getRmtSportsGroupBySport(body);

      return results;
    } catch (err) {
      log(err);
      throw new ServerError();
    }
  }

  @ApiOperationGet(getRmtSportByCompetition)
  @Get('event-by-competition')
  async getRmtSportsByCategory(
    @QueryParams() body: GetRmtSportByCompetitionDto,
  ): Promise<GetRmtSportByCategoryResponseDto> {
    try {
      const results = await this.rmtService.getRmtSportsGroupByCompetition(body);

      return results;
    } catch (err) {
      log(err);
      throw new ServerError();
    }
  }

  @ApiOperationPost(saveRmtSport)
  @Post('event/save')
  async saveRmtSportByCompetition(
    @Body() body: SaveRmtSportByCompetitionDto,
    @Req() req: Request,
  ): Promise<SuccessStatusResponse> {
    const transaction = await sequelize.transaction();
    try {
      await this.rmtService.saveSport(body, transaction);
      await UserLog.add(USER_LOG_ACTIONS.SAVE_RMT_SPORT, req, transaction);

      await transaction.commit();
      return DEFAULT_SUCCESS_RESPONSE;
    } catch (err) {
      await transaction.rollback();
      log(err);
      throw new SaveError();
    }
  }

  @ApiOperationGet(getRmtCategory)
  @Get('category')
  async getRmtCategory(@QueryParams() body: GetRmtCategoryBySport): Promise<GetRmtCategoryResponseDto[]> {
    try {
      const results = await this.rmtService.getRmtCategoriesBySport(body);
      return results;
    } catch (err) {
      log(err);
      throw new ServerError();
    }
  }

  @ApiOperationGet(getRmtCompetition)
  @Get('competition')
  async getRmtCompetition(@QueryParams() body: GetRmtCompetitionBySport): Promise<GetRmtCompetitionResponseDto[]> {
    try {
      const results = await this.rmtService.getRmtCompetitionsByCategory(body);
      return results;
    } catch (err) {
      log(err);
      throw new ServerError();
    }
  }

  @ApiOperationPost(saveRmtBaseSettings)
  @Post('base-settings/save')
  async saveRmtBaseSettings(@Body() body: SaveRmtBaseSettingsDto, @Req() req: Request): Promise<SuccessStatusResponse> {
    this.rmtService.validateBaseSettings(body);
    const transaction = await sequelize.transaction();
    try {
      await this.rmtService.saveRmtBaseSettings(body, transaction);

      await UserLog.add(USER_LOG_ACTIONS.SAVE_RMT_BASE_SETTINGS, req, transaction);

      await transaction.commit();

      return DEFAULT_SUCCESS_RESPONSE;
    } catch (err) {
      log(err);
      await transaction.rollback();
      throw new SaveError();
    }
  }

  @ApiOperationGet(getRmtBaseSettings)
  @Get('base-settings')
  async getRmtBaseSettings(): Promise<RMTBaseSettings> {
    try {
      const results = await this.rmtService.getRmtBaseSettings();
      return results;
    } catch (err) {
      log(err);
      throw new ServerError();
    }
  }

  @ApiOperationGet(getRmtTeam)
  @Get('team')
  async getRmtTeams(@QueryParams() body: GetRmtTeamDto): Promise<GetRmtTeamResponseDto> {
    try {
      const results = await this.rmtService.getRmtTeams(body);
      return results;
    } catch (err) {
      log(err);
      throw new ServerError();
    }
  }

  @ApiOperationPost(saveRmtTeam)
  @Post('team/save')
  async saveRmtTeam(@Body() body: SaveRmtTeamDto, @Req() req: Request): Promise<SuccessStatusResponse> {
    const transaction = await sequelize.transaction();
    try {
      await this.rmtService.saveRmtTeam(body, transaction);

      await UserLog.add(USER_LOG_ACTIONS.SAVE_RMT_TEAM, req, transaction);

      await transaction.commit();

      return DEFAULT_SUCCESS_RESPONSE;
    } catch (err) {
      log(err);
      await transaction.rollback();
      throw new SaveError();
    }
  }

  @ApiOperationPost(saveRmtPlayer)
  @Post('player/save')
  async saveRmtPlayer(@Body() body: SaveRmtPlayerDto, @Req() req: Request): Promise<SuccessStatusResponse> {
    const transaction = await sequelize.transaction();
    try {
      await this.rmtService.saveRmtPlayer(body, transaction);
      await UserLog.add(USER_LOG_ACTIONS.SAVE_RMT_PLAYER, req, transaction);

      await transaction.commit();

      return DEFAULT_SUCCESS_RESPONSE;
    } catch (err) {
      log(err);
      await transaction.rollback();
      throw new SaveError();
    }
  }

  @ApiOperationGet(getRmtPlayer)
  @Get('player')
  async getRmtPlayer(): Promise<SaveRmtPlayerDto> {
    try {
      const data = (await this.rmtService.getRmtPlayer()) as SaveRmtPlayerDto;
      return data;
    } catch (err) {
      log(err);
      throw new SaveError();
    }
  }
}
