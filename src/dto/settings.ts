import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { BOOLEAN_SMALLINT } from './shared';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

@ApiModel({
  name: 'SaveSiteDomainDto',
})
export class SaveSiteDomainDto {
  @ApiModelProperty()
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @ApiModelProperty()
  @IsString()
  @Matches(/^(www\.)([a-zA-Z.\d\-_])+$/, {
    message: 'url is invalid, should be look like - www.xxx.yy',
  })
  url: string;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  active?: number = 1;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  is_default?: number = 0;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  big_logo_active?: number = 1;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  small_logo_active?: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  favicon_active?: number = 1;

  @ApiModelProperty({
    example: [0, 1],
    description: 'Destroy existing big logo',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  big_logo_destroy?: number = 0;

  @ApiModelProperty({
    example: [0, 1],
    description: 'Destroy existing small logo',
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  small_logo_destroy?: number = 0;
}

@ApiModel({
  name: 'AddSiteDomainDto',
})
export class AddSiteDomainDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @ApiModelProperty()
  @IsString()
  @Matches(/^(www\.)([a-zA-Z.\d\-_])+$/, {
    message: 'url is invalid, should be look like - www.xxx.yy',
  })
  url: string;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  active?: number = 1;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  is_default?: number = 0;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  big_logo_active?: number = 1;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  small_logo_active?: number;

  @ApiModelProperty({
    example: [0, 1],
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsEnum(BOOLEAN_SMALLINT)
  favicon_active?: number = 1;
}
