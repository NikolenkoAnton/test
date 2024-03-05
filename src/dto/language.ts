import { Type } from 'class-transformer';
import { IsString, IsNumber, IsEnum, IsInt, IsOptional, Matches, MinLength } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { TranslateLanguage } from '../db/models';
import { IsEntityExists } from './custom_validators/is_entity_exists';
import { ValidateCyrillic } from './custom_validators/page';
import { BOOLEAN_SMALLINT, BOOLEAN_SMALLINT_SWAGGER_EXAMPLE } from './shared';

@ApiModel({
  name: 'CreateLanguageRequest',
})
export class CreateLanguageRequest {
  @ApiModelProperty()
  @Matches(/^([A-Za-z]|\s|\-)+$/, {
    message: 'Name can contain only latin letters ',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiModelProperty()
  @IsString()
  @ValidateCyrillic()
  @MinLength(1)
  @Matches(/^\w+(\-\w+)?$/, {
    message: 'short is invalid, should be look like: "en", "en-us" ',
  })
  short: string;

  @ApiModelProperty({
    example: BOOLEAN_SMALLINT_SWAGGER_EXAMPLE,
  })
  @Type(() => Number)
  @IsInt()
  @IsEnum(BOOLEAN_SMALLINT)
  is_default = 0;

  @ApiModelProperty({
    example: BOOLEAN_SMALLINT_SWAGGER_EXAMPLE,
  })
  @Type(() => Number)
  @IsInt()
  @IsEnum(BOOLEAN_SMALLINT)
  active = 1;
}

@ApiModel({
  name: 'UpdateLanguageRequest',
  description: 'Params to save language',
})
export class UpdateLanguageRequest {
  @ApiModelProperty()
  @IsEntityExists(TranslateLanguage)
  @IsInt()
  @Type(() => Number)
  id: number;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  @Matches(/^([A-Za-z]|\s|\-)+$/, {
    message: 'Name can contain only latin letters ',
  })
  @MinLength(1)
  name?: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  @MinLength(1)
  @ValidateCyrillic()
  @Matches(/^\w+(\-\w+)?$/, {
    message: 'short is invalid, should be look like: "en", "en-us" ',
  })
  short?: string;

  @ApiModelProperty({
    example: BOOLEAN_SMALLINT_SWAGGER_EXAMPLE,
  })
  @IsInt()
  @Type(() => Number)
  @IsEnum(BOOLEAN_SMALLINT)
  @IsOptional()
  is_default?: number;

  @ApiModelProperty({
    example: BOOLEAN_SMALLINT_SWAGGER_EXAMPLE,
  })
  @IsInt()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  @Type(() => Number)
  active = 1;
}
