import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { values } from 'lodash';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { ARRAY, OBJECT } from '../../../swagger/swagger-type';
import config from '../../config';
import { DatetimeRange } from '../../dto/shared';
import { BET_HISTORY_TABLE_COLUMNS_ENUM } from '../../helper/constants';
import { BET_RESULTS_ENUM, BET_TYPES_ENUM } from '../../helper/bet_constants';

@ApiModel({
  name: 'GetBetsDto',
})
export class GetBetsDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  page = 1;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  per_page? = config.DEFAULT_PAGINATION_SIZE;

  @ApiModelProperty()
  @IsOptional()
  generate_file?: boolean;

  @ApiModelProperty({
    model: 'DatetimeRange',
  })
  @IsOptional()
  bet_result?: DatetimeRange;

  @ApiModelProperty({
    example: ['cashout', 'no_cashout'],
  })
  @IsOptional()
  cashout?: string[];

  @ApiModelProperty({
    model: 'DatetimeRange',
  })
  @IsOptional()
  bet_placement?: DatetimeRange;

  @ApiModelProperty({
    type: ARRAY,
    enum: values(BET_RESULTS_ENUM),
    example: values(BET_RESULTS_ENUM),
  })
  @IsOptional()
  bet_results?: any[];

  @ApiModelProperty({
    type: ARRAY,
    enum: ['comboboost', 'freebet_all_win', 'freebet_only_win', 'freebet_no_risk', 'lootbox', 'hunting'],
    example: ['comboboost', 'freebet_all_win', 'freebet_only_win', 'freebet_no_risk', 'lootbox', 'hunting'],
  })
  @IsOptional()
  bonus_filters?: string[];

  @ApiModelProperty({
    enum: values(BET_TYPES_ENUM),
    example: values(BET_TYPES_ENUM),
    type: ARRAY,
  })
  @IsOptional()
  bet_types?: string[];

  @ApiModelProperty({
    enum: ['live', 'prematch'],
    type: ARRAY,
    example: ['live', 'prematch'],
  })
  @IsOptional()
  bet_sections?: string;

  @ApiModelProperty()
  @IsOptional()
  min_stake?: number;

  @ApiModelProperty()
  @IsOptional()
  max_stake?: number;

  @ApiModelProperty()
  @IsOptional()
  min_risks?: number;

  @ApiModelProperty()
  @IsOptional()
  max_risks?: number;

  @ApiModelProperty()
  @IsOptional()
  sport_name?: string | string[];

  @ApiModelProperty()
  @IsOptional()
  category_name?: string | string[];

  @ApiModelProperty()
  @IsOptional()
  competition_name?: string | string[];

  @ApiModelProperty()
  @IsOptional()
  game_name?: string | string[];

  @ApiModelProperty()
  @IsOptional()
  sport_id?: string | string[];

  @ApiModelProperty()
  @IsOptional()
  category_id?: string | string[];

  @ApiModelProperty()
  @IsOptional()
  competition_id?: string | string[];

  @ApiModelProperty()
  @IsOptional()
  game_id?: string | string[];

  @ApiModelProperty()
  @IsOptional()
  customer_id?: number | number[];

  @ApiModelProperty()
  @IsOptional()
  cashdesk_id?: number | number[];

  @ApiModelProperty()
  @IsOptional()
  platform_user_id?: number | number[];

  @ApiModelProperty()
  @IsOptional()
  platform_id?: number | number[];

  @ApiModelProperty()
  @IsOptional()
  id?: number | number[];

  @ApiModelProperty()
  @IsOptional()
  market?: string | string[];

  @ApiModelProperty()
  @IsOptional()
  order?: string;

  @IsEnum(BET_HISTORY_TABLE_COLUMNS_ENUM, { each: true })
  @ApiModelProperty({
    enum: Object.values(BET_HISTORY_TABLE_COLUMNS_ENUM),
    type: ARRAY,
    example: Object.values(BET_HISTORY_TABLE_COLUMNS_ENUM),
  })
  columns: BET_HISTORY_TABLE_COLUMNS_ENUM[] = Object.values(BET_HISTORY_TABLE_COLUMNS_ENUM);
}

@ApiModel()
export class SaveBetHistoryPresetRequest {
  @ApiModelProperty()
  @IsOptional()
  @IsString()
  id?: number;

  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty({ type: OBJECT })
  default_preset?: any;

  @ApiModelProperty({ type: OBJECT })
  filter_preset?: any;
}
