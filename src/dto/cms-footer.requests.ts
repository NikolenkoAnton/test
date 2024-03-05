import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { ARRAY } from '../../swagger/swagger-type';
import { CmsFooterBlock, SiteDomain, TranslateLanguage } from '../db/models';
import { IsEntityExists } from './custom_validators/is_entity_exists';
import { ValidateCyrillic } from './custom_validators/page';
import { BOOLEAN_SMALLINT, PatchActiveAndPositionElementDto } from './shared';

@ApiModel({
  name: 'CreateCmsFooterGroupElementValueRequest',
})
export class CreateCmsFooterGroupElementValueRequest {
  @ApiModelProperty()
  @ValidateCyrillic()
  @Length(1, 20)
  title: string;

  @ApiModelProperty()
  @IsInt()
  language_id: number;

  @ApiModelProperty()
  @IsInt()
  site_domain_id: number;

  @ApiModelProperty()
  @IsOptional()
  url: string;
}

@ApiModel({ name: 'CreateCmsFooterGroupElementRequest' })
export class CreateCmsFooterGroupElementRequest {
  @ApiModelProperty()
  @IsInt()
  cms_footer_group_id;

  @ApiModelProperty()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  target_blank: number;

  @ApiModelProperty({ model: 'CreateCmsFooterGroupElementValueRequest' })
  @ValidateNested({ each: true })
  @Type(() => CreateCmsFooterGroupElementValueRequest)
  values: CreateCmsFooterGroupElementValueRequest[];
}

@ApiModel({
  name: 'CreateCmsFooterGroupValueRequest',
})
export class CreateCmsFooterGroupValueRequest {
  @ApiModelProperty()
  id?: number;

  @ApiModelProperty()
  @ValidateCyrillic()
  @Length(1, 20)
  title: string;

  @ApiModelProperty()
  @IsInt()
  language_id: number;

  @ApiModelProperty()
  @IsInt()
  site_domain_id: number;
}

@ApiModel({
  name: 'CreateCmsFooterGroupRequest',
})
export class CreateCmsFooterGroupRequest {
  @ApiModelProperty()
  cms_footer_block_id: number;

  @ApiModelProperty()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;

  @ApiModelProperty({ model: 'CreateCmsFooterGroupValueRequest' })
  @Type(() => CreateCmsFooterGroupValueRequest)
  @ValidateNested({ each: true })
  values?: CreateCmsFooterGroupValueRequest[];
}

@ApiModel({ name: 'CreateCmsFooterBlockRequest' })
export class CreateCmsFooterBlockRequest {
  @ApiModelProperty()
  @IsInt()
  cms_footer_block_type_id: number;

  @ApiModelProperty()
  @ValidateCyrillic()
  title: string;

  @ApiModelProperty()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;
}

@ApiModel({
  name: 'UpdateCmsFooterGroupElementValueRequest',
})
export class UpdateCmsFooterGroupElementValueRequest {
  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsInt()
  language_id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsInt()
  site_domain_id: number;

  @ApiModelProperty()
  @ValidateCyrillic()
  @Length(1, 20)
  @IsOptional()
  title: string;

  @ApiModelProperty()
  @IsOptional()
  url?: string;
}

@ApiModel({
  name: 'UpdateCmsFooterGroupElementRequest',
})
export class UpdateCmsFooterGroupElementRequest {
  @ApiModelProperty()
  @IsInt()
  id: number;

  @ApiModelProperty()
  @IsEnum(BOOLEAN_SMALLINT)
  @IsOptional()
  active: number;

  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  position: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  target_blank: number;

  @ApiModelProperty({ model: 'UpdateCmsFooterGroupElementValueRequest' })
  @Type(() => UpdateCmsFooterGroupElementValueRequest)
  @ValidateNested({ each: true })
  @IsOptional()
  values?: UpdateCmsFooterGroupElementValueRequest[];
}

@ApiModel({
  name: 'UpdateCmsFooterGroupValueRequest',
})
export class UpdateCmsFooterGroupValueRequest {
  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsInt()
  language_id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsInt()
  site_domain_id: number;

  @ApiModelProperty()
  @ValidateCyrillic()
  @Length(1, 20)
  title: string;
}

@ApiModel({
  name: 'UpdateCmsFooterLogoRequest',
})
export class UpdateCmsFooterLogoRequest {
  @ApiModelProperty()
  @IsInt()
  id: number;

  @ApiModelProperty()
  @ValidateCyrillic()
  @IsOptional()
  @Length(1, 20)
  title: string;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  @IsOptional()
  active: number;

  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  position: number;

  @ApiModelProperty({ model: 'PatchActiveAndPositionElementDto' })
  @ValidateNested({ each: true })
  @Type(() => PatchActiveAndPositionElementDto)
  @IsArray()
  @IsOptional()
  values?: PatchActiveAndPositionElementDto[];
}

@ApiModel({
  name: 'UpdateCmsFooterGroupRequest',
})
export class UpdateCmsFooterGroupRequest {
  @ApiModelProperty()
  @IsInt()
  id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  @IsOptional()
  active: number;

  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  position: number;

  @ApiModelProperty({ model: 'UpdateCmsFooterGroupValueRequest' })
  @ValidateNested({ each: true })
  @Type(() => UpdateCmsFooterGroupValueRequest)
  @IsArray()
  @IsOptional()
  values?: UpdateCmsFooterGroupValueRequest[];

  @ApiModelProperty({ model: 'UpdateCmsFooterGroupElementRequest' })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateCmsFooterGroupElementRequest)
  elements: UpdateCmsFooterGroupElementRequest[];
}

@ApiModel({ name: 'UpdateCmsFooterRowBlockRequest' })
export class UpdateCmsFooterRowBlockRequest {
  @ApiModelProperty({ model: 'UpdateCmsFooterBlockRequest' })
  @ValidateNested({ each: true })
  @Type(() => UpdateCmsFooterBlockRequest)
  @IsArray()
  rows: UpdateCmsFooterBlockRequest[];
}

@ApiModel({ name: 'UpdateCmsFooterBlockRequest' })
export class UpdateCmsFooterBlockRequest {
  @ApiModelProperty()
  @IsInt()
  cms_footer_block_id: number;

  @ApiModelProperty()
  @ValidateCyrillic()
  @IsString()
  @IsOptional()
  @MinLength(1)
  title: string;

  @ApiModelProperty()
  @IsEnum(BOOLEAN_SMALLINT)
  @IsOptional()
  active: number;

  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  position: number;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpdateCmsFooterGroupRequest)
  @IsOptional()
  @ApiModelProperty({ model: 'UpdateCmsFooterGroupRequest', type: ARRAY })
  groups?: UpdateCmsFooterGroupRequest[];

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpdateCmsFooterLogoRequest)
  @IsOptional()
  @ApiModelProperty({ model: 'UpdateCmsFooterLogoRequest', type: ARRAY })
  logos?: UpdateCmsFooterLogoRequest;
}

@ApiModel({ name: 'BodyWithElementId' })
export class BodyWithElementId {
  @ApiModelProperty()
  @IsInt()
  cms_footer_group_element_id: number;
}

@ApiModel({ name: 'BodyWithGroupId' })
export class BodyWithGroupId {
  @ApiModelProperty()
  @IsInt()
  cms_footer_group_id: number;
}

@ApiModel({ name: 'BodyWithBlockId' })
export class BodyWithBlockId {
  @ApiModelProperty()
  @IsInt()
  cms_footer_block_id: number;
}
@ApiModel({
  name: 'SaveCmsFooterTextBlockDto',
})
export class SaveCmsFooterTextBlockDto {
  @ApiModelProperty({ description: 'menu_group_id value on updating' })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  cms_footer_block_id?: number;

  @ApiModelProperty({
    model: 'CmsFooterTextBlockValueDto',
  })
  @ValidateNested({ each: true })
  @IsOptional()
  @IsArray()
  @Type(() => CmsFooterTextBlockValueDto)
  values?: CmsFooterTextBlockValueDto[] = [];
}

@ApiModel({
  name: 'CmsFooterTextBlockValueDto',
})
export class CmsFooterTextBlockValueDto {
  @ApiModelProperty()
  @IsNumber()
  language_id: number;

  @ApiModelProperty()
  @IsNumber()
  @IsEntityExists(SiteDomain)
  site_domain_id: number;

  @ApiModelProperty()
  @IsString()
  @MinLength(1, {
    message: 'text is too short',
  })
  text: string;
}

@ApiModel({
  name: 'RemoveCmsFooterTextDto',
})
export class RemoveCmsFooterTextDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'SaveCmsFooterLogoBlockDto',
})
export class SaveCmsFooterLogoBlockDto {
  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id?: number;

  @ValidateCyrillic()
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiModelProperty()
  @Type(() => Number)
  @IsEntityExists(CmsFooterBlock)
  @IsNumber()
  cms_footer_block_id: number;

  @ApiModelProperty()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  position?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  @Type(() => Number)
  active?: number;

  @ApiModelProperty({
    model: 'SaveCmsFooterLogoBlockValueDto',
    example: {
      site_domain_id: 1,
      url: 'http://asd',
      image: 'binary',
    },
  })
  @Type(() => SaveCmsFooterLogoBlockValueDto)
  @ValidateNested({ each: true })
  @IsArray()
  values: SaveCmsFooterLogoBlockValueDto[];
}

@ApiModel({
  name: 'SaveCmsFooterLogoBlockValueDto',
})
export class SaveCmsFooterLogoBlockValueDto {
  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsEntityExists(SiteDomain)
  site_domain_id: number;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  url: string;
}

@ApiModel({
  name: 'GetByCmsFooterBlockDto',
})
export class GetByCmsFooterBlockDto {
  @ApiModelProperty()
  @IsNumber()
  cms_footer_block_id: number;
}

@ApiModel({
  name: 'SaveCmsFooterChatBlockDto',
})
export class SaveCmsFooterChatBlockDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiModelProperty()
  @IsEntityExists(CmsFooterBlock)
  @IsNumber()
  cms_footer_block_id: number;

  @ApiModelProperty({
    model: 'SaveCmsFooterChatValueDto',
  })
  @Type(() => SaveCmsFooterChatValueDto)
  @ValidateNested({ each: true })
  @IsArray()
  values: SaveCmsFooterChatValueDto[];
}

export class SaveCmsFooterChatValueDto {
  @ValidateCyrillic()
  @ApiModelProperty()
  @IsString()
  @MinLength(1)
  name: string;

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
  name: 'SaveCmsFooterValidatorBlockDto',
})
export class SaveCmsFooterValidatorBlockDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiModelProperty()
  @IsEntityExists(CmsFooterBlock)
  @IsNumber()
  cms_footer_block_id: number;

  @ApiModelProperty({
    model: 'SaveCmsFooterValidatorValueDto',
  })
  @Type(() => SaveCmsFooterValidatorValueDto)
  @ValidateNested({ each: true })
  @IsArray()
  values: SaveCmsFooterValidatorValueDto[];
}

export class SaveCmsFooterValidatorValueDto {
  @ApiModelProperty()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number;

  @ValidateCyrillic()
  @ApiModelProperty()
  @IsString()
  @Matches(/^(?!\/)[a-zA-Z0-9\-]*$/, {
    message: 'seals_id contains forbidden characters (allow only "-"), numbers and latin letters',
  })
  @MinLength(1)
  seals_id: string;

  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  @IsEntityExists(SiteDomain)
  site_domain_id: number;
}
