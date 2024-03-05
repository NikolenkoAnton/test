import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  Max,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import config from '../config';
import {
  RMT_CATEGORY_SORT,
  RMT_COMPETITION_SORT,
  RMT_MARKET_SORT,
  RMT_SPORT_BY_CATEGORY_SORT,
  RMT_SPORT_SORT,
  RMT_TEAM_SORT,
  SORT_DIR,
} from '../helper/constants';
import { Type } from 'class-transformer';
import { BOOLEAN_SMALLINT } from './shared';
import { IsBiggerOrEqualThan, IsBiggerThan, IsNullable } from './custom_validators/rmt';

@ApiModel({
  name: 'GetRmtMarketDto',
})
export class GetRmtMarketDto {
  @ApiModelProperty()
  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  sport_ids?: Array<number>;

  @ApiModelProperty()
  @IsOptional()
  @MinLength(1)
  market?: string;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  profit_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  profit_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_quantity_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_quantity_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_sum_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_sum_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  rtp_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  rtp_max?: number;

  @ApiModelProperty()
  @IsEnum(BOOLEAN_SMALLINT)
  @IsOptional()
  active?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  per_page?: number = config.DEFAULT_PAGINATION_SIZE;

  @ApiModelProperty()
  @ValidateIf((o) => !!o.date_to)
  @IsNotEmpty()
  @IsDateString()
  date_from?: string;

  @ApiModelProperty()
  @IsDateString()
  @IsOptional()
  date_to?: string;

  @ApiModelProperty({
    enum: RMT_MARKET_SORT,
    example: RMT_MARKET_SORT,
  })
  @IsOptional()
  @IsEnum(RMT_MARKET_SORT)
  sort_by?: string;

  @ApiModelProperty({
    enum: Object.values(SORT_DIR),
    example: Object.values(SORT_DIR),
  })
  @IsOptional()
  @IsEnum(Object.values(SORT_DIR))
  sort_dir?: string;
}

@ApiModel({
  name: 'SaveRmtMarketDto',
})
export class SaveRmtMarketDto {
  @ApiModelProperty({
    model: 'SaveRmtMarketElementDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SaveRmtMarketElementDto)
  @ArrayNotEmpty()
  data: SaveRmtMarketElementDto[];
}

@ApiModel({
  name: 'SaveRmtMarketElementDto',
})
export class SaveRmtMarketElementDto {
  @ApiModelProperty()
  @IsNumber()
  market_id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_bet: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  delay: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_player_event: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  margin: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;
}

@ApiModel({
  name: 'SaveRmtSportElementDto',
})
export class SaveRmtSportElementDto {
  @ApiModelProperty()
  @IsNumber()
  sport_id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_bet: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  delay: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_player_event: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  margin: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;
}

@ApiModel({
  name: 'SaveRmtSportByCompetitionDto',
})
export class SaveRmtSportByCompetitionDto {
  @ApiModelProperty({
    model: 'SaveRmtSportElementDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => SaveRmtSportElementDto)
  sports?: SaveRmtSportElementDto[] = [];

  @ApiModelProperty({
    model: 'SaveRmtCategoryElementDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => SaveRmtCategoryElementDto)
  categories?: SaveRmtCategoryElementDto[] = [];

  @ApiModelProperty({
    model: 'SaveRmtCompetitionElementDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @Type(() => SaveRmtCompetitionElementDto)
  competitions?: SaveRmtCompetitionElementDto[] = [];
}

@ApiModel({
  name: 'SaveRmtCategoryElementDto',
})
export class SaveRmtCategoryElementDto {
  @ApiModelProperty()
  @IsNumber()
  category_id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_bet: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  delay: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_player_event: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  margin: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;
}

@ApiModel({
  name: 'SaveRmtCompetitionElementDto',
})
export class SaveRmtCompetitionElementDto {
  @ApiModelProperty()
  @IsNumber()
  competition_id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_bet: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  delay: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_player_event: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  margin: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;
}

@ApiModel({
  name: 'GetRmtSportByCompetitionDto',
})
export class GetRmtSportByCompetitionDto {
  @ApiModelProperty()
  @IsOptional()
  @MinLength(3)
  competition?: string;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  profit_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  profit_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_quantity_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_quantity_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_sum_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_sum_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  rtp_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  rtp_max?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  per_page?: number = config.DEFAULT_PAGINATION_SIZE;

  @ApiModelProperty()
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsDateString()
  date_to?: string;

  @ApiModelProperty({
    enum: RMT_SPORT_BY_CATEGORY_SORT,
    example: RMT_SPORT_BY_CATEGORY_SORT,
  })
  @IsOptional()
  @IsEnum(RMT_SPORT_BY_CATEGORY_SORT)
  sort_by?: string = RMT_SPORT_BY_CATEGORY_SORT[0];

  @ApiModelProperty({
    enum: Object.values(SORT_DIR),
    example: Object.values(SORT_DIR),
  })
  @IsOptional()
  @IsEnum(Object.values(SORT_DIR))
  sort_dir?: string = SORT_DIR.ASC;
}

@ApiModel({
  name: 'GetRmtSportDto',
})
export class GetRmtSportDto {
  @ApiModelProperty()
  @IsArray()
  @IsOptional()
  sport_ids?: Array<number>;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  profit_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  profit_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_quantity_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_quantity_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_sum_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_sum_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  rtp_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  rtp_max?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  per_page?: number = config.DEFAULT_PAGINATION_SIZE;

  @ApiModelProperty()
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsDateString()
  date_to?: string;

  @ApiModelProperty({
    enum: RMT_SPORT_SORT,
    example: RMT_SPORT_SORT,
  })
  @IsOptional()
  @IsEnum(RMT_SPORT_SORT)
  sort_by?: string = RMT_SPORT_SORT[0];

  @ApiModelProperty({
    enum: Object.values(SORT_DIR),
    example: Object.values(SORT_DIR),
  })
  @IsOptional()
  @IsEnum(Object.values(SORT_DIR))
  sort_dir?: string = SORT_DIR.ASC;
}

@ApiModel({
  name: 'GetRmtTeamDto',
})
export class GetRmtTeamDto {
  @ApiModelProperty()
  @IsArray()
  @IsOptional()
  sport_ids?: Array<number>;

  @ApiModelProperty()
  @IsOptional()
  @MinLength(1)
  team?: string;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  profit_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  profit_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_quantity_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_quantity_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_sum_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  bet_sum_max?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  rtp_min?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  rtp_max?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  per_page?: number = config.DEFAULT_PAGINATION_SIZE;

  @ApiModelProperty()
  @IsOptional()
  @IsDateString()
  date_from?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsDateString()
  date_to?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(RMT_TEAM_SORT)
  sort_by?: string = RMT_TEAM_SORT[0];

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(Object.values(SORT_DIR))
  sort_dir?: string = SORT_DIR.ASC;
}

@ApiModel({
  name: 'SaveRmtBaseSettingsDto',
})
export class SaveRmtBaseSettingsDto {
  @ApiModelProperty({
    description: 'Basic risk per bet (EUR)',
  })
  @IsNumber()
  @Min(0.01)
  basic_risk_per_bet: number;

  @ApiModelProperty({
    description: 'Min_bet (per bet)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  minimal_max_risk_per_bet: number | null;

  @ApiModelProperty({
    description: 'Max_bet (per bet)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsBiggerThan('minimal_max_risk_per_bet', {
    message: "maximal_max_risk_per_bet should be more then minimal_max_risk_per_bet'",
  })
  maximal_max_risk_per_bet: number | null;

  @ApiModelProperty({
    description: 'Minimal_max_win (per bet)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  min_bet_per_bet: number | null;

  @ApiModelProperty({
    description: 'Maximal_max_win (per bet)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsBiggerThan('minimal_max_risk_per_bet', {
    message: "maximal_max_risk_per_bet should be more then minimal_max_risk_per_bet'",
  })
  max_bet_per_bet: number | null;

  @ApiModelProperty({
    description: 'Quantity of events with odds',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  odd_events_count: number | null;

  @ApiModelProperty({
    description: 'Powers',
  })
  @IsNumber()
  @Min(0.01)
  odd_events_count_power: number | null;

  @ApiModelProperty({
    description: 'Limit for combos and systems',
  })
  @IsNumber()
  @Min(0.01)
  max_risk_combos_systems: number | null;

  @ApiModelProperty({
    description: 'Basic delay (sec)',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  basic_delay: number;

  @ApiModelProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  min_delay: number | null;

  @ApiModelProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(20)
  @IsBiggerThan('min_delay', {
    message: "max_delay should be more then min_delay'",
  })
  max_delay: number | null;

  @ApiModelProperty({
    description: 'Close market if k <',
  })
  @IsNullable()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  show_market_sum_limit: number | null;

  @ApiModelProperty({
    description: 'Close event if no markets (sec)',
  })
  @IsNullable()
  @IsNumber()
  @Min(0.01)
  show_market_time_limit: number | null;

  @ApiModelProperty({
    description: 'Basic risk per event',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  basic_max_risk_per_event: number;

  @ApiModelProperty({
    description: 'Minimal max win (per bet)',
  })
  @IsNullable()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  minimal_max_risk_per_event: number | null;

  @ApiModelProperty({
    description: 'Maximal max win (per bet)',
  })
  @IsNullable()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @IsBiggerThan('minimal_max_risk_per_event', {
    message: "maximal_max_risk_per_event should be more then minimal_max_risk_per_event'",
  })
  maximal_max_risk_per_event: number | null;

  @ApiModelProperty({
    model: 'SaveRmtBaseSettingsOddsDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SaveRmtBaseSettingsOddsDto)
  odds: SaveRmtBaseSettingsOddsDto[];

  @ApiModelProperty({
    model: 'SaveRmtBaseSettingsMarginDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SaveRmtBaseSettingsMarginDto)
  margins: SaveRmtBaseSettingsMarginDto[];
}

@ApiModel({
  name: 'SaveRmtBaseSettingsOddsDto',
})
export class SaveRmtBaseSettingsOddsDto {
  @ApiModelProperty()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.01)
  from: number;

  @ApiModelProperty()
  @IsNullable()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.01)
  to: number | null;

  @ApiModelProperty()
  @IsNullable()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  step: number | null;
}

@ApiModel({
  name: 'SaveRmtBaseSettingsMarginDto',
})
export class SaveRmtBaseSettingsMarginDto {
  @ApiModelProperty()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.01)
  from: number;

  @ApiModelProperty()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  to: number;

  @ApiModelProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  margin_percent: number;
}

@ApiModel({
  name: 'SaveRmtPlayerGroupDto',
})
class SaveRmtPlayerGroupDto {
  @ApiModelProperty({
    description: 'coefficient K from',
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(1)
  k_from: number;

  @ApiModelProperty({
    description: 'coefficient K to',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsBiggerOrEqualThan('k_from', {
    message: 'k_to should be more or equal then k_from',
  })
  k_to: number;

  @ApiModelProperty({
    description: 'coefficient neutral zone from',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  nz_from: number;

  @ApiModelProperty({
    description: 'coefficient neutral zone to',
  })
  @IsOptional()
  @IsNumber()
  @IsBiggerOrEqualThan('nz_from', {
    message: 'nz_to should be more or equal then nz_from',
  })
  nz_to: number;
}

@ApiModel({
  name: 'SaveRmtPlayerProfitGroupDto',
})
class SaveRmtPlayerProfitGroupDto {
  @ApiModelProperty({
    description: 'coefficient K from',
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(1)
  k_from: number;

  @ApiModelProperty({
    description: 'coefficient K to',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsBiggerOrEqualThan('k_from', {
    message: 'k_to should be more or equal then k_from',
  })
  k_to: number;

  @ApiModelProperty({
    description: 'coefficient neutral zone from',
  })
  @IsOptional()
  @IsNumber()
  @Min(-1000)
  @Max(-1)
  nz_from: number;

  @ApiModelProperty({
    description: 'coefficient neutral zone to',
  })
  @IsOptional()
  @IsNumber()
  @IsBiggerOrEqualThan('nz_from', {
    message: 'nz_to should be more or equal then nz_from',
  })
  @Min(1)
  @Max(1000)
  nz_to: number;
}

@ApiModel({
  name: 'SaveRmtPlayerRtpDto',
})
export class SaveRmtPlayerRtpDto {
  @ApiModelProperty({
    model: 'SaveRmtPlayerRtpElDto',
    description: 'Max win bet grouping',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SaveRmtPlayerRtpElDto)
  @ArrayNotEmpty()
  max_risk_bet: SaveRmtPlayerRtpElDto[];

  @ApiModelProperty({
    model: 'SaveRmtPlayerRtpElDto',
    description: 'Delay grouping',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SaveRmtPlayerRtpElDto)
  @ArrayNotEmpty()
  delay: SaveRmtPlayerRtpElDto[];

  @ApiModelProperty({
    model: 'SaveRmtPlayerRtpElDto',
    description: 'Max win event grouping',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SaveRmtPlayerRtpElDto)
  @ArrayNotEmpty()
  max_win_event: SaveRmtPlayerRtpElDto[];

  @ApiModelProperty({
    model: 'SaveRmtPlayerRtpElDto',
    description: 'Margin grouping',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SaveRmtPlayerRtpElDto)
  @ArrayNotEmpty()
  margin: SaveRmtPlayerRtpElDto[];
}

@ApiModel({
  name: 'SaveRmtPlayerRtpElDto',
})
export class SaveRmtPlayerRtpElDto {
  @ApiModelProperty({
    description: 'Player with highest RTP % from',
  })
  @IsNumber()
  @IsInt()
  @Min(0)
  @Max(100)
  from: number;

  @ApiModelProperty({
    description: 'Player with highest RTP % to',
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(100)
  @IsBiggerThan('from', {
    message: 'to should be more then from',
  })
  to: number;

  @ApiModelProperty({
    description: 'Coefficient K',
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(100)
  k: number;
}

@ApiModel({
  name: 'SaveRmtPlayerSectionDto',
})
class SaveRmtPlayerSectionDto {
  @ApiModelProperty({
    model: 'SaveRmtPlayerGroupDto',
    description: 'Max win bet grouping',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerGroupDto)
  @IsNotEmptyObject()
  max_risk_bet: SaveRmtPlayerGroupDto;

  @ApiModelProperty({
    model: 'SaveRmtPlayerGroupDto',
    description: 'Delay grouping',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerGroupDto)
  @IsNotEmptyObject()
  delay: SaveRmtPlayerGroupDto;

  @ApiModelProperty({
    model: 'SaveRmtPlayerGroupDto',
    description: 'Max win event grouping',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerGroupDto)
  @IsNotEmptyObject()
  max_win_event: SaveRmtPlayerGroupDto;

  @ApiModelProperty({
    model: 'SaveRmtPlayerGroupDto',
    description: 'Margin grouping',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerGroupDto)
  @IsNotEmptyObject()
  margin: SaveRmtPlayerGroupDto;
}

@ApiModel({
  name: 'SaveRmtPlayerProfitSectionDto',
})
class SaveRmtPlayerProfitSectionDto {
  @ApiModelProperty({
    model: 'SaveRmtPlayerProfitGroupDto',
    description: 'Max win bet grouping',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerProfitGroupDto)
  @IsNotEmptyObject()
  max_risk_bet: SaveRmtPlayerProfitGroupDto;

  @ApiModelProperty({
    model: 'SaveRmtPlayerProfitGroupDto',
    description: 'Delay grouping',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerProfitGroupDto)
  @IsNotEmptyObject()
  delay: SaveRmtPlayerProfitGroupDto;

  @ApiModelProperty({
    model: 'SaveRmtPlayerProfitGroupDto',
    description: 'Max win event grouping',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerProfitGroupDto)
  @IsNotEmptyObject()
  max_win_event: SaveRmtPlayerProfitGroupDto;

  @ApiModelProperty({
    model: 'SaveRmtPlayerProfitGroupDto',
    description: 'Margin grouping',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerProfitGroupDto)
  @IsNotEmptyObject()
  margin: SaveRmtPlayerProfitGroupDto;
}

@ApiModel({
  name: 'SaveRmtPlayerDto',
})
export class SaveRmtPlayerDto {
  @ApiModelProperty({
    model: 'SaveRmtPlayerSectionDto',
    description: 'Number of bets section',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerSectionDto)
  @IsNotEmptyObject()
  num_of_bets: SaveRmtPlayerSectionDto;

  @ApiModelProperty({
    model: 'SaveRmtPlayerProfitSectionDto',
    description: 'Profit section',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerProfitSectionDto)
  @IsNotEmptyObject()
  profit: SaveRmtPlayerProfitSectionDto;

  @ApiModelProperty({
    model: 'SaveRmtPlayerRtpDto',
    description: 'RTP Theoretical section',
  })
  @ValidateNested()
  @Type(() => SaveRmtPlayerRtpDto)
  @IsNotEmptyObject()
  rtp_theoretical: SaveRmtPlayerRtpDto;
}

@ApiModel({ name: 'GetRmtCategoryBySport' })
export class GetRmtCategoryBySport {
  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  sport_id: number;

  @ApiModelProperty({
    enum: RMT_CATEGORY_SORT,
    example: RMT_CATEGORY_SORT,
  })
  @IsOptional()
  @IsEnum(RMT_CATEGORY_SORT)
  sort_by?: string;

  @ApiModelProperty({
    enum: Object.values(SORT_DIR),
    example: Object.values(SORT_DIR),
  })
  @IsOptional()
  @IsEnum(Object.values(SORT_DIR))
  sort_dir?: string;
}

@ApiModel({ name: 'GetRmtCategoriesBySport' })
export class GetRmtCompetitionBySport {
  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  category_id: number;

  @ApiModelProperty({
    enum: RMT_COMPETITION_SORT,
    example: RMT_COMPETITION_SORT,
  })
  @IsOptional()
  @IsEnum(RMT_COMPETITION_SORT)
  sort_by?: string;

  @ApiModelProperty({
    enum: Object.values(SORT_DIR),
    example: Object.values(SORT_DIR),
  })
  @IsOptional()
  @IsEnum(Object.values(SORT_DIR))
  sort_dir?: string;
}

@ApiModel({
  name: 'SaveRmtTeamDto',
})
export class SaveRmtTeamDto {
  @ApiModelProperty({
    model: 'SaveRmtTeamElementDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SaveRmtTeamElementDto)
  @ArrayNotEmpty()
  data: SaveRmtTeamElementDto[];
}

@ApiModel({
  name: 'SaveRmtTeamElementDto',
})
export class SaveRmtTeamElementDto {
  @ApiModelProperty()
  @IsNumber()
  team_id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_bet: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  delay: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  max_risk_player_event: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Max(100)
  margin: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;
}
