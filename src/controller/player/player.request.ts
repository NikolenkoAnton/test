import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { values } from 'lodash';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { ARRAY } from '../../../swagger/swagger-type';
import config from '../../config';
import { BET_RESULTS_ENUM, BET_TYPES_ENUM } from '../../helper/bet_constants';
import { DateIntervalPayload } from '../../interface/common';
import { PLAYER_TIME_CHUNK_TYPES, PLAYER_VIEW_MAIN_TABS } from './constant';

@ApiModel()
export class GetPlayerGraphQuery {
  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  user_id: number;

  @ApiModelProperty()
  @IsOptional()
  sport_ids?: string[];

  @ApiModelProperty()
  @IsOptional()
  category_ids?: string[];

  @ApiModelProperty()
  @IsOptional()
  competition_ids?: string[];

  @ApiModelProperty({
    type: ARRAY,
    enum: values(BET_RESULTS_ENUM),
    example: values(BET_RESULTS_ENUM),
  })
  @IsOptional()
  bet_results?: any[];

  @ApiModelProperty({
    enum: values(BET_TYPES_ENUM),
    example: values(BET_TYPES_ENUM),
    type: ARRAY,
  })
  @IsOptional()
  bet_types?: string[];

  @ApiModelProperty()
  @IsOptional()
  outcome_counts?: string[];

  @ApiModelProperty()
  @IsOptional()
  date_interval?: DateIntervalPayload[] = [];
}

@ApiModel()
export class GetPlayerAnalyticQuery {
  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  player_id?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  platform_user_id?: number;

  @ApiModelProperty({
    enum: values(PLAYER_VIEW_MAIN_TABS),
    example: PLAYER_VIEW_MAIN_TABS,
  })
  @IsOptional()
  @IsEnum(PLAYER_VIEW_MAIN_TABS)
  @Type(() => String)
  order_by?: string;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => String)
  order_direction?: string = 'desc';

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  page = 1;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  per_page? = config.DEFAULT_PAGINATION_SIZE;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  min_bet_count?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  max_bet_count?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  min_profit?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  max_profit?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  min_bet_sum?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  max_bet_sum?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  min_rtp?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  max_rtp?: number;
}

@ApiModel()
export class GetPlayerStatQuery {
  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  user_id: number;

  @ApiModelProperty()
  @Type(() => String)
  @IsString()
  order: OrderByType = 'desc';

  @ApiModelProperty()
  @Type(() => String)
  @IsEnum(PLAYER_VIEW_MAIN_TABS)
  main_tab: PLAYER_VIEW_MAIN_TABS = PLAYER_VIEW_MAIN_TABS.BET_COUNTS;

  @ApiModelProperty()
  @Type(() => String)
  @IsEnum(PLAYER_TIME_CHUNK_TYPES)
  chunk_size?: PLAYER_TIME_CHUNK_TYPES = PLAYER_TIME_CHUNK_TYPES.MONTH;

  @ApiModelProperty()
  @Type(() => Date)
  start_date?: Date;

  @ApiModelProperty()
  @Type(() => Date)
  end_date?: Date;

  @ApiModelProperty()
  @Type(() => Number)
  sport_id?: number;

  @ApiModelProperty()
  @Type(() => Number)
  category_id?: number;
}
