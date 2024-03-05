import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsEnum,
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
  Min,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { SiteDomain, TranslateLanguage } from '../db/models';
import { ValidatePositions } from './custom_validators/faq';
import { IsEntityExists } from './custom_validators/is_entity_exists';
import { BOOLEAN_SMALLINT, PatchActiveAndPositionElementDto } from './shared';
import { UpdateCompetitionTopTextValuesDto } from './widget';
import { ValidateCyrillic } from './custom_validators/page';

@ApiModel({
  name: 'BurgerBlockUpdateRequest',
})
export class BurgerBlockUpdateRequest {
  @ApiModelProperty()
  @IsNumber()
  id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  @IsNumber()
  active?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  position?: number;

  @ApiModelProperty({
    model: 'UpdateBurgerItemValuesRequest',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpdateBurgerItemValuesRequest)
  @ArrayNotEmpty()
  @IsOptional()
  @ValidatePositions('data', {
    message: 'position should not be duplicated',
  })
  values?: PatchActiveAndPositionElementDto[];

  @ApiModelProperty({
    model: 'PatchActiveAndPositionElementDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PatchActiveAndPositionElementDto)
  @ArrayNotEmpty()
  @IsOptional()
  @ValidatePositions('data', {
    message: 'position should not be duplicated',
  })
  items?: PatchActiveAndPositionElementDto[];
}

@ApiModel({
  name: 'BurgerBlockPatchManyRequest',
})
export class BurgerBlockPatchManyRequest {
  @ApiModelProperty({
    model: 'BurgerBlockUpdateRequest',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => BurgerBlockUpdateRequest)
  @ArrayNotEmpty()
  @ValidatePositions('data', {
    message: 'position should not be duplicated',
  })
  data: BurgerBlockUpdateRequest[];
}

@ApiModel({
  name: 'UpdateBurgerItemValuesRequest',
})
export class UpdateBurgerItemValuesRequest {
  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  url?: string;

  @ApiModelProperty()
  @IsNumber()
  @Type(() => Number)
  site_domain_id: number;

  @ApiModelProperty()
  @IsNumber()
  @Type(() => Number)
  language_id: number;
}

@ApiModel({
  name: 'UpdateBurgerItemRequest',
})
export class UpdateBurgerItemRequest {
  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  burger_block_id?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  target_blank: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  active: number = 1;

  @ApiModelProperty({
    model: 'UpdateBurgerItemValuesRequest',
  })
  @IsArray()
  @IsNotEmpty()
  values: UpdateBurgerItemValuesRequest[];
}
