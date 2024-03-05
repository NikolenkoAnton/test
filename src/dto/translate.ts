import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsEnum, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { BOOLEAN_SMALLINT } from './shared';
import { Transform, Type } from 'class-transformer';

@ApiModel({
  name: 'GetLanguagesDto',
})
export class GetLanguagesDto {
  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  @IsNumber()
  @Type(() => Number)
  active?: 0 | 1;
}

@ApiModel({
  name: 'SaveLanguageDto',
  description: 'Params to save language',
})
export class SaveLanguageDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiModelProperty()
  @IsString()
  name: string;

  @ApiModelProperty()
  @IsString()
  short: string;

  @ApiModelProperty({
    example: Object.values(BOOLEAN_SMALLINT),
  })
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  default = 0;

  @ApiModelProperty({
    example: Object.values(BOOLEAN_SMALLINT),
  })
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  active = 1;
}

@ApiModel({
  name: 'DeleteLanguageDto',
  description: 'Params to delete language',
})
export class DeleteLanguageDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'GetTranslateKeysDto',
})
export class GetTranslateKeysDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiModelProperty({ example: 100 })
  @IsOptional()
  @IsNumber()
  per_page?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiModelProperty()
  @IsOptional()
  groups?: string[];
}

@ApiModel({
  name: 'GetTranslateKeyValuesDto',
})
export class GetTranslateKeyValuesDto {
  @ApiModelProperty()
  @IsNumber()
  key_id: number;
}

@ApiModel({
  name: 'TranslateKeyValuesDto',
})
export class TranslateKeyValuesDto {
  @ApiModelProperty()
  @IsNumber()
  language_id: number;

  @ApiModelProperty()
  @IsNumber()
  site_domain_id: number;

  @ApiModelProperty()
  @IsString()
  value: string;
}

@ApiModel({
  name: 'SaveTranslateKeyDto',
})
export class SaveTranslateKeyDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiModelProperty()
  @IsString()
  @Transform((value) => value.trim())
  // @Matches(/^[a-z \.\-_]+$/i, {
  //   message: 'Name can contain only latin letters and space dot underscore or minus',
  // })
  key: string;

  @ApiModelProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiModelProperty({
    model: 'TranslateKeyValuesDto',
    // required: false,
  })
  values: TranslateKeyValuesDto[];
}

@ApiModel({
  name: 'DeleteTranslateKeyDto',
})
export class DeleteTranslateKeyDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}
