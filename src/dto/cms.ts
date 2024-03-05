import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import {
  IMAGE_DESTINATION_ENUM,
  MAIN_BANNER_SLIDE_SCHEDULE_ENUM,
  PRVEIOUS_IMAGES_CHOOSE_MODE_ENUM,
  REDIRECT_PAGE_TYPES,
} from '../helper/constants';
import { ValidatePositions } from './custom_validators/faq';
import { ValidateCyrillic } from './custom_validators/page';
import { BOOLEAN_SMALLINT } from './shared';
import { IsEntityExists } from './custom_validators/is_entity_exists';
import { TranslateLanguage } from '../db/models';
import { IsBeforeStartDate, IsTimeNotExpired } from './custom_validators/cms_banner';

@ApiModel({
  name: 'SaveGeneralSeoDto',
})
export class SaveGeneralSeoDto {
  @ApiModelProperty({
    model: 'RowGeneralSeoDto',
  })
  data: RowGeneralSeoDto[];
}
@ApiModel({
  name: 'RowGeneralSeoDto',
})
export class RowGeneralSeoDto {
  @ApiModelProperty()
  @IsString()
  site_domain_id: number;

  @ApiModelProperty()
  @IsString()
  block: string;

  @ApiModelProperty()
  @IsString()
  key: string;

  @ApiModelProperty()
  @IsString()
  value: string;
}

@ApiModel({
  name: 'GetPagesDto',
})
export class GetPagesDto {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  page?: number;
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  per_page?: number;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Search should be minimum of 3 characters' })
  @ApiModelProperty()
  search?: string;
}

@ApiModel({
  name: 'GetPageDto',
})
export class GetPageDto {
  @IsNumber()
  @ApiModelProperty()
  id: number;
}

@ApiModel({
  name: 'SavePageDto',
})
export class SavePageDto {
  @IsNumber()
  @IsOptional()
  @ApiModelProperty()
  id?: number;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!\/)[a-zA-Z0-9\-\/]+(?!\/)\b$/, {
    message:
      'url contains forbidden characters(allow only "-", "/"(not use in the beginning and the end of string)), numbers and letters',
  })
  url: string;

  @ApiModelProperty({
    model: 'PageValueDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PageValueDto)
  values: PageValueDto[];
}

@ApiModel({
  name: 'PageValueDto',
})
export class PageValueDto {
  @ApiModelProperty()
  @IsInt()
  language_id: number;

  @ApiModelProperty()
  @IsInt()
  site_domain_id: number;

  // @ApiModelProperty()//todo tmp
  // @IsOptional()
  // @IsString()
  // canonical_url?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  @Length(1, 120)
  title?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  @Length(1, 300)
  description?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  @Length(1, 16)
  text_btn?: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  faq_title?: string;

  @ApiModelProperty({
    example: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  faq_active?: number = 1;

  @ApiModelProperty()
  @IsBoolean()
  index: boolean;

  @ApiModelProperty({
    model: 'FAQQuestionDto',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => FAQQuestionDto)
  @ValidatePositions('faq_questions', {
    message: 'question should not have duplicate positions',
  })
  faq_questions?: FAQQuestionDto[];

  @ApiModelProperty()
  @IsString()
  @Matches(/^[-a-zA-Z0-9:._\\+~#?&=\/!*'();@$,%\[\]]+$/, {
    message: 'redirect_target cannot start with "/" or have non-Latin letters',
  })
  @IsOptional()
  redirect_target?: string;

  @ApiModelProperty({ example: 301 })
  @IsOptional()
  @IsEnum(Object.values(REDIRECT_PAGE_TYPES))
  redirect_type?: number;
}

@ApiModel({
  name: 'DeletePageDto',
})
export class DeletePageDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'GetPreviousImagesDto',
})
export class GetPreviousImagesDto {
  @ApiModelProperty({
    example: 'top_competition',
  })
  @IsString()
  section: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Search should be minimum of 3 characters' })
  search?: string;
}

@ApiModel({
  name: 'ChoosePreviousImagesMultipleRecordsDto',
})
export class ChoosePreviousImagesMultipleRecordsDto {
  @ApiModelProperty({
    model: 'ChoosePreviousImagesDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => ChoosePreviousImagesDto)
  data: ChoosePreviousImagesDto[];
}

@ApiModel({
  name: 'ChoosePreviousImagesDto',
})
export class ChoosePreviousImagesDto {
  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  image_id?: number;

  @IsEnum(PRVEIOUS_IMAGES_CHOOSE_MODE_ENUM)
  @ApiModelProperty({ enum: Object.values(PRVEIOUS_IMAGES_CHOOSE_MODE_ENUM) })
  mode: PRVEIOUS_IMAGES_CHOOSE_MODE_ENUM = PRVEIOUS_IMAGES_CHOOSE_MODE_ENUM.REPLACE;

  @ApiModelProperty()
  @IsArray()
  @IsOptional()
  image_ids?: number[];

  @ApiModelProperty()
  @IsNumber()
  id: number;

  @ApiModelProperty({
    example: Object.values(IMAGE_DESTINATION_ENUM),
  })
  @IsEnum(Object.values(IMAGE_DESTINATION_ENUM))
  section: IMAGE_DESTINATION_ENUM;
}

@ApiModel({
  name: 'ChoosePreviousImagesValuesDto',
})
export class ChoosePreviousImagesValuesDto {
  @ApiModelProperty({
    model: 'ChoosePreviousImagesValuesDataDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => ChoosePreviousImagesValuesDataDto)
  values: ChoosePreviousImagesValuesDataDto[];

  @ApiModelProperty({
    example: Object.values(IMAGE_DESTINATION_ENUM),
  })
  @IsEnum(Object.values(IMAGE_DESTINATION_ENUM))
  section: IMAGE_DESTINATION_ENUM;
}

@ApiModel({
  name: 'ChoosePreviousImagesValuesDataDto',
})
export class ChoosePreviousImagesValuesDataDto {
  @ApiModelProperty()
  @IsNumber()
  image_id: number;

  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'DeletePreviousImagesDto',
})
export class DeletePreviousImagesDto {
  @ApiModelProperty()
  @IsNumber()
  image_id: number;
}

@ApiModel({
  name: 'FAQQuestionDto',
})
export class FAQQuestionDto {
  @ApiModelProperty()
  @IsNumber()
  @Min(0)
  position: number;

  @IsString()
  @ApiModelProperty()
  @IsNotEmpty()
  question: string;

  @IsString()
  @ApiModelProperty()
  @IsNotEmpty()
  answer: string;
}

@ApiModel({
  name: 'SaveStaticPageDto',
})
export class SaveStaticPageDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiModelProperty()
  @IsString()
  @ValidateCyrillic()
  @Matches(/^(?!\/)[a-zA-Z0-9\-\/]+(?!\/)\b$/, {
    message:
      'slug contains forbidden characters(allow only "-", "/"(not use in the beginning and the end of string)), numbers and letters',
  })
  @Transform((value) => value.toLowerCase())
  @MinLength(1)
  slug: string;

  @ApiModelProperty()
  @IsString()
  @ValidateCyrillic()
  @MinLength(1)
  title: string;

  @ApiModelProperty()
  @IsNumber()
  template_id: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  active?: number = 0;

  @ApiModelProperty({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  preview?: number = undefined;

  @ApiModelProperty({
    example: Object.values(MAIN_BANNER_SLIDE_SCHEDULE_ENUM),
    description: `if ${MAIN_BANNER_SLIDE_SCHEDULE_ENUM.scheduled} schedule_start_date, schedule_start_time, schedule_finish_date, schedule_finish_time should be provided`,
  })
  @IsOptional()
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
  schedule_finish_date: string;

  @ApiModelProperty({
    example: 'Time format HH-MM (12:00)',
  })
  @ValidateIf((obj) => obj.schedule_finish_date)
  @IsMilitaryTime()
  @IsTimeNotExpired('schedule_start_date', {
    message: 'schedule finish time should be bigger then schedule start time',
  })
  schedule_finish_time: string;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.Model.Property.Type.BOOLEAN })
  @IsBoolean()
  display_for_logged_in = true;

  @ApiModelProperty({ type: SwaggerDefinitionConstant.Model.Property.Type.BOOLEAN })
  @IsBoolean()
  display_for_not_logged_in = true;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  custom_css: string;

  @ApiModelProperty({
    model: 'StaticPageValueDto',
  })
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @Type(() => StaticPageValueDto)
  values?: StaticPageValueDto[] = [];
}

@ApiModel({
  name: 'StaticPageValueDto',
})
export class StaticPageValueDto {
  @ApiModelProperty()
  @IsNumber()
  @IsEntityExists(TranslateLanguage)
  language_id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  site_domain_id: number;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  text: string;
}

@ApiModel({
  name: 'GetStaticPageDto',
})
export class GetStaticPageDto {
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  page?: number;
  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  per_page?: number;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Search should be minimum of 3 characters' })
  @ApiModelProperty()
  search?: string;
}

@ApiModel({
  name: 'DeleteStaticPageDto',
})
export class DeleteStaticPageDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

export class SaveCmsFile {
  @ApiModelProperty()
  @IsString()
  name: string;
}

@ApiModel({
  name: 'GetSportListDto',
})
export class GetSportListDto {
  @ApiModelProperty()
  @IsNumber()
  @IsEntityExists(TranslateLanguage)
  language_id: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  sport_id?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  competition_id?: number;
}

@ApiModel({
  name: 'OrderSportListDataDto',
})
export class OrderSportListDataDto {
  @ApiModelProperty()
  @IsNumber()
  @IsEntityExists(TranslateLanguage)
  language_id: number;

  @ApiModelProperty({ model: 'OrderSportListSportDto' })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => OrderSportListSportDto)
  @IsNotEmpty()
  sports: OrderSportListSportDto[];
}

@ApiModel({
  name: 'OrderSportListSportDto',
})
class OrderSportListSportDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;

  @ApiModelProperty()
  @IsNumber()
  @Min(1)
  position: number;

  @ApiModelProperty()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  favorite: number;

  @ApiModelProperty({ model: 'OrderSportListCategoriesDto' })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => OrderSportListCategoriesDto)
  @IsNotEmpty()
  categories: OrderSportListCategoriesDto[];
}

class OrderSportListCategoriesDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;

  @ApiModelProperty()
  @IsNumber()
  @Min(1)
  position: number;

  @ApiModelProperty()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  favorite: number;

  @ApiModelProperty({ model: 'OrderSportListCompetitionsDto' })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => OrderSportListCompetitionsDto)
  @IsNotEmpty()
  competitions: OrderSportListCompetitionsDto[];
}

class OrderSportListCompetitionsDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;

  @ApiModelProperty()
  @IsNumber()
  @Min(1)
  position: number;

  @ApiModelProperty()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  favorite: number;
}

@ApiModel({
  name: 'OrderSportListDto',
})
export class OrderSportListDto {
  @ApiModelProperty({ model: 'OrderSportListDataDto' })
  @Type(() => OrderSportListDataDto)
  @IsNotEmpty()
  @ValidateNested()
  data: OrderSportListDataDto;
}
