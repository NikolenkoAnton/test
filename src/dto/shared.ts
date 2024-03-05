import { IsInt } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { ArrayNotEmpty, IsArray, IsEnum, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidatePositions } from './custom_validators/faq';
import config from '../config';

export enum BOOLEAN_SMALLINT {
  FALSE = 0,
  TRUE = 1,
}

export const BOOLEAN_SMALLINT_SWAGGER_EXAMPLE = [0, 1];

@ApiModel({ name: 'PaginationRequest' })
export class PaginationRequest {
  @ApiModelProperty({ example: 123 })
  @IsNumber()
  page = 1;

  @ApiModelProperty()
  @IsNumber()
  per_page = config.DEFAULT_PAGINATION_SIZE;
}

@ApiModel({
  name: 'DatetimeRange',
})
export class DatetimeRange {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  start?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  end?: number;
}

@ApiModel({ name: 'BodyWithId' })
export class BodyWithId {
  @ApiModelProperty()
  @IsInt()
  @IsOptional()
  id?: number;
}

@ApiModel({ name: 'QueryWithId' })
export class QueryWithId {
  @ApiModelProperty()
  @Type(() => Number)
  @IsInt()
  id: number;
}

@ApiModel({
  name: 'PatchActiveAndPositionDto',
})
export class PatchActiveAndPositionDto {
  @ApiModelProperty({
    model: 'PatchActiveAndPositionElementDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PatchActiveAndPositionElementDto)
  @ArrayNotEmpty()
  @ValidatePositions('data', {
    message: 'position should not be duplicated',
  })
  data: PatchActiveAndPositionElementDto[];
}

@ApiModel({
  name: 'PatchActiveAndPositionElementDto',
})
export class PatchActiveAndPositionElementDto {
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
  @Min(1)
  position?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  target_blank?: number;
}

@ApiModel({
  name: 'PatchActiveDto',
})
export class PatchActiveDto {
  @ApiModelProperty({
    model: 'PatchActiveElementDto',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PatchActiveElementDto)
  @ArrayNotEmpty()
  @ValidatePositions('data', {
    message: 'position should not be duplicated',
  })
  data: PatchActiveElementDto[];
}

@ApiModel({
  name: 'PatchActiveElementDto',
})
export class PatchActiveElementDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;

  @ApiModelProperty()
  @IsOptional()
  @IsEnum(BOOLEAN_SMALLINT)
  @IsNumber()
  active?: number;
}
