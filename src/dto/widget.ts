import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsISO8601,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { Country, ExternalBannerSize, SiteDomain, TranslateLanguage } from '../db/models';
import {
  FORM_BANNER_SLIDE_TYPE_ENUM,
  MAIN_BANNER_SLIDE_SCHEDULE_ENUM,
  MAIN_BANNER_SLIDE_TYPE_ENUM,
  TEASER_EVENT_STATUS_ENUM,
  TEASER_TYPE,
} from '../helper/constants';
import { IsBeforeStartDate, IsTimeNotExpired } from './custom_validators/cms_banner';
import { RejectIfConditionTrue } from './custom_validators/cms_teaser';
import { IsEntityExists } from './custom_validators/is_entity_exists';
import { BOOLEAN_SMALLINT } from './shared';
import { ValidateCyrillic } from './custom_validators/page';
import { ValidateTextEditor } from './custom_validators/regex';
import config from '../config';
import { ScheduleTypeEnum } from '../interface/calendar-schedule.type';

@ApiModel({
  name: 'GetCompetitionTopDto',
})
export class GetCompetitionTopDto {
  @ApiModelProperty()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Search should be minimum of 3 characters' })
  search?: string;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;
}

@ApiModel({
  name: 'GetTeaserDto',
})
export class GetTeaserDto {
  @ApiModelProperty()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Search should be minimum of 3 characters' })
  search?: string;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  active?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  has_game?: number;
}

@ApiModel({
  name: 'GetMainBannerSlideDto',
})
export class GetMainBannerSlideDto {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  per_page?: number = config.DEFAULT_PAGINATION_SIZE;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Search should be minimum of 3 characters' })
  search?: string;
}

@ApiModel({
  name: 'UpdateCompetitionTopDto',
  description: 'Data needed to create or update competition top',
})
export class UpdateCompetitionTopDto {
  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiModelProperty()
  @IsString()
  @ValidateCyrillic()
  @Matches(/^(?!\/)[a-zA-Z0-9\-\/]*$/, {
    message:
      'slug contains forbidden characters(allow only "-", "/"(not use in the beginning of string)), numbers and letters',
  })
  @Transform((value) => value.toLowerCase())
  @MinLength(1)
  slug: string;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  competition_id: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sport_id: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  category_id: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  position?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  category_alias?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsEnum(BOOLEAN_SMALLINT)
  @ApiModelProperty()
  active?: number;

  @ApiModelProperty()
  @IsString()
  color = '#000000';

  @ApiModelProperty({ model: 'UpdateCompetitionTopTextValuesDto' })
  @ValidateNested({ each: true })
  @Type(() => UpdateCompetitionTopTextValuesDto)
  @IsArray()
  @IsNotEmpty()
  text_values: UpdateCompetitionTopTextValuesDto[];
}

@ApiModel({
  name: 'UpdateCompetitionTopTextValuesDto',
})
export class UpdateCompetitionTopTextValuesDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty()
  @IsNumber()
  @Type(() => Number)
  @IsEntityExists(SiteDomain)
  site_domain_id: number;

  @ApiModelProperty()
  @IsNumber()
  @Type(() => Number)
  @IsEntityExists(TranslateLanguage)
  language_id: number;
}

@ApiModel({
  name: 'DeleteCompetitionTopDto',
})
export class DeleteCompetitionTopDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'DeleteTeaserDto',
})
export class DeleteTeaserDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'UpdateTeaserDto',
})
export class UpdateTeaserDto {
  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  competition_id: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  sport_id: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  category_id: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  event_id?: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  position?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  @ApiModelProperty()
  active?: number;

  @ApiModelProperty({
    example: Object.values(TEASER_TYPE),
  })
  @IsEnum(Object.values(TEASER_TYPE))
  type: string;

  @ApiModelProperty({
    example: Object.values(TEASER_EVENT_STATUS_ENUM),
  })
  @IsEnum(Object.values(TEASER_EVENT_STATUS_ENUM))
  event_status: string;

  @ApiModelProperty()
  @RejectIfConditionTrue(
    (obj) =>
      (obj.event_status === TEASER_EVENT_STATUS_ENUM.ALL || obj.event_status === TEASER_EVENT_STATUS_ENUM.PREMATCH) &&
      !obj.delay_before_event,
    {
      message: 'delay_before_event should not be null if event status ALL or PREMATCH or LIVE',
    },
  )
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  delay_before_event: number;
}

@ApiModel({
  name: 'UpdateMainBannerSlideDto',
})
export class UpdateMainBannerSlideDto {
  @ApiModelProperty()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiModelProperty()
  // @Type(() => Number)
  @IsOptional()
  @IsArray()
  group_ids?: number[] = [];

  @ApiModelProperty({
    example: Object.values(MAIN_BANNER_SLIDE_TYPE_ENUM),
    description: `
      ${MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_WITH_BUTTON} - Half image with button
      ${MAIN_BANNER_SLIDE_TYPE_ENUM.HALF_IMAGE_NO_BUTTON} - Half image without button
      ${MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_WITH_BUTTON} - Full image with button
      ${MAIN_BANNER_SLIDE_TYPE_ENUM.FULL_IMAGE_NO_BUTTON} - Full image without button
    `,
  })
  @IsEnum(Object.values(MAIN_BANNER_SLIDE_TYPE_ENUM))
  type: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  external?: string;

  @ApiModelProperty({
    example: Object.values(MAIN_BANNER_SLIDE_SCHEDULE_ENUM),
    description: `if ${MAIN_BANNER_SLIDE_SCHEDULE_ENUM.scheduled} schedule_start_date, schedule_start_time, schedule_finish_date, schedule_finish_time should be provided`,
  })
  @IsEnum(Object.values(MAIN_BANNER_SLIDE_SCHEDULE_ENUM))
  schedule: string;

  @ApiModelProperty({
    example: 'Date format YYYY-MM-DD (2022-10-29)',
  })
  @ValidateIf((obj) => obj.schedule === MAIN_BANNER_SLIDE_SCHEDULE_ENUM.scheduled)
  @IsISO8601({ strict: true })
  schedule_start_date: string;

  @ApiModelProperty({
    example: 'Time format HH-MM (12:00)',
  })
  @ValidateIf((obj) => obj.schedule === MAIN_BANNER_SLIDE_SCHEDULE_ENUM.scheduled)
  @IsMilitaryTime()
  schedule_start_time: string;

  @ApiModelProperty({
    example: 'Date format YYYY-MM-DD (2022-10-29)',
  })
  @ValidateIf((obj) => obj.schedule_finish_date)
  @IsISO8601({ strict: true })
  @IsBeforeStartDate('schedule_start_date', {
    message: 'schedule_finish_date should be bigger then schedule_start_date',
  })
  schedule_finish_date: string = null;

  @ApiModelProperty({
    example: 'Time format HH-MM (12:00)',
  })
  @ValidateIf((obj) => obj.schedule_finish_date)
  @IsMilitaryTime()
  @IsTimeNotExpired('schedule_start_date', {
    message: 'schedule finish time should be bigger then schedule start time',
  })
  schedule_finish_time: string = null;

  @ApiModelProperty()
  @IsArray()
  schedule_days: number[] = [1];

  @ApiModelProperty()
  @IsEnum(ScheduleTypeEnum)
  schedule_type: ScheduleTypeEnum = ScheduleTypeEnum.DAY;

  @ApiModelProperty()
  time_zone: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsEnum(BOOLEAN_SMALLINT)
  @ApiModelProperty()
  active?: number;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  title_color: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  small_text_color: string;

  @ApiModelProperty()
  @IsString()
  background_color: string = null;

  @Type(() => Number)
  @IsEnum(BOOLEAN_SMALLINT)
  @ApiModelProperty({ type: SwaggerDefinitionConstant.Model.Property.Type.NUMBER })
  display_for_logged_in = 1;

  @Type(() => Number)
  @IsEnum(BOOLEAN_SMALLINT)
  @ApiModelProperty({ type: SwaggerDefinitionConstant.Model.Property.Type.NUMBER })
  display_for_not_logged_in = 1;

  @ApiModelProperty({ model: 'UpdateMainBannerSlideTextValueDto' })
  @ValidateNested({ each: true })
  @Type(() => UpdateMainBannerSlideTextValueDto)
  @IsArray()
  @IsNotEmpty()
  text_values: UpdateMainBannerSlideTextValueDto[];
}

@ApiModel({
  name: 'UpdateMainBannerSlideTextValueDto',
})
export class UpdateMainBannerSlideTextValueDto {
  @ApiModelProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  //25 (half), full (31)
  title: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  @ValidateTextEditor()
  small_text: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  //12
  button_name: string;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsEntityExists(SiteDomain)
  site_domain_id: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsEntityExists(TranslateLanguage)
  language_id: number;
}

@ApiModel({
  name: 'DeleteMainBannerSlideDto',
})
export class DeleteMainBannerSlideDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'GetAllCategoriesBySportDto',
})
export class GetAllCategoriesBySportDto {
  @ApiModelProperty()
  @IsNumber()
  sport_id: number;
}

@ApiModel({
  name: 'GetAllCompetitionsByCategoryDto',
})
export class GetAllCompetitionsByCategoryDto {
  @ApiModelProperty()
  @IsNumber()
  category_id: number;
}

@ApiModel({
  name: 'GetAllEventsByCategoryDto',
})
export class GetAllEventsByCategoryDto {
  @ApiModelProperty()
  @IsNumber()
  competition_id: number;
}

@ApiModel({
  name: 'SaveFormBannerSlideDto',
})
export class SaveFormBannerSlideDto {
  @ApiModelProperty()
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsEnum(BOOLEAN_SMALLINT)
  @ApiModelProperty()
  active?: number = BOOLEAN_SMALLINT.TRUE;

  @ApiModelProperty({
    example: Object.values(FORM_BANNER_SLIDE_TYPE_ENUM),
  })
  @IsEnum(Object.values(FORM_BANNER_SLIDE_TYPE_ENUM))
  type: string;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  title_color: string;

  @ApiModelProperty({ model: 'SaveFormBannerSlideTextValueDto' })
  @ValidateNested({ each: true })
  @Type(() => SaveFormBannerSlideTextValueDto)
  @IsArray()
  @IsNotEmpty()
  text_values: SaveFormBannerSlideTextValueDto[];
}

@ApiModel({
  name: 'SaveFormBannerSlideTextValueDto',
})
export class SaveFormBannerSlideTextValueDto {
  @ApiModelProperty()
  @IsString()
  @Length(1, 16)
  text: string;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsEntityExists(SiteDomain)
  site_domain_id: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsEntityExists(TranslateLanguage)
  language_id: number;

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    example: ['card 1', 'card 2'],
  })
  @IsOptional()
  @Type(() => String)
  @ArrayMaxSize(4)
  @IsArray()
  @Length(1, 36, { each: true })
  cards: string[];
}

@ApiModel({
  name: 'SaveExternalBannerSlideDto',
})
export class SaveExternalBannerSlideDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiModelProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiModelProperty()
  @IsNumber()
  type: number;

  @ApiModelProperty()
  @IsNumber()
  @Min(0)
  delay_before_event: number;

  @ApiModelProperty()
  @IsString()
  time_zone: string;

  @ApiModelProperty()
  @IsArray()
  @IsEntityExists(Country, { each: true })
  countries: [number];

  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  @ApiModelProperty()
  active?: number = BOOLEAN_SMALLINT.TRUE;

  @ApiModelProperty({
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsEntityExists(ExternalBannerSize, { each: true })
  sizes: [number];

  @ApiModelProperty({
    model: 'SaveExternalBannerSlideEventDto',
  })
  @ValidateNested({ each: true })
  @Type(() => SaveExternalBannerSlideEventDto)
  @ArrayMinSize(1)
  events: SaveExternalBannerSlideEventDto[];
}

@ApiModel({
  name: 'SaveExternalBannerSlideEventDto',
})
export class SaveExternalBannerSlideEventDto {
  @ApiModelProperty()
  @Type(() => Number)
  @IsOptional()
  id?: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  sport_id: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  competition_id: number;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  category_id: number;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  event_id?: number;
}
