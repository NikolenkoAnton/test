import { every, map, values } from 'lodash';
import { Get, QueryParams } from 'routing-controllers';
import { ApiOperationGet } from 'swagger-express-ts';
import { Inject } from 'typedi';
import {
  getPlayerAnalyticSwagger,
  getPlayerGraphSwagger,
  getPlayerStat,
  getPlayerStatResults,
  getPlayerStatSports,
  getPlayerStatTime,
  getPlayerStatTypes,
} from '../../../swagger/operations/bet';
import { QueryWithId } from '../../dto';

import { DefaultController } from '../../helper/custom-controller.decorator';
import { PlayerResponseInterceptor } from '../../interceptor/player.response.interceptor';
import { PLAYER_VIEW_MAIN_TABS } from './constant';
import { GetPlayerAnalyticQuery, GetPlayerGraphQuery, GetPlayerStatQuery } from './player.request';
import { PlayerService } from './player.service';

@DefaultController('/player', 'Player Management', [PlayerResponseInterceptor])
export class PlayerController {
  @Inject()
  private playerService: PlayerService;

  @ApiOperationGet(getPlayerAnalyticSwagger)
  @Get('analytics')
  async getPlayerAnalytics(@QueryParams() data: GetPlayerAnalyticQuery) {
    const { page, per_page, order_direction, order_by, ...filters } = data;

    
    if (every(values(filters), (item) => item === null || item === undefined)) {
      return [];
    }
    const response = await this.playerService.getAnalyticsPlayers(data);

    return response;
  }

  @ApiOperationGet(getPlayerStat)
  @Get('view')
  async getPlayerView(@QueryParams() data: QueryWithId) {
    const response = await this.playerService.getPlayerView(data.id);

    return response;
  }

  @ApiOperationGet(getPlayerGraphSwagger)
  @Get('graph')
  async getPlayerGraph(@QueryParams() data: GetPlayerGraphQuery) {
    const response = await this.playerService.getPlayerGraph(data);

    return response;
  }

  @ApiOperationGet(getPlayerStatSports)
  @Get('events')
  async getPlayerStatBySports(@QueryParams() data: GetPlayerStatQuery) {
    const responses = await this.playerService.getPlayerStatBySports(data);

    return responses;
  }

  @ApiOperationGet(getPlayerStatResults)
  @Get('results')
  async getPlayerStatByResults(@QueryParams() data: GetPlayerStatQuery) {
    const responses = await this.playerService.getPlayerStatByResults(data);

    return responses;
  }

  @ApiOperationGet(getPlayerStatTime)
  @Get('time')
  async getPlayerStatByTime(@QueryParams() data: GetPlayerStatQuery) {
    let responses = await this.playerService.getPlayerStatByTime(data);

    if (data.main_tab === PLAYER_VIEW_MAIN_TABS.RTP) {
      responses = map(responses, (item: any) => {
        const rtp = item.stake_sum === 0 ? null : item.rtp;

        return { ...item, rtp };
      });
    }

    return responses;
  }

  @ApiOperationGet(getPlayerStatTypes)
  @Get('types')
  async getPlayerStatByTypes(@QueryParams() data: GetPlayerStatQuery) {
    const responses = await this.playerService.getPlayerStatByTypes(data);

    return responses;
  }
}
