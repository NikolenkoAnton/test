import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

@ApiModel({
  name: 'GetSportsDto',
})
export class GetSportsDto {
  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiModelProperty()
  @IsOptional()
  @IsNumber()
  per_page?: number;

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Search should be minimum of 3 characters' })
  @ApiModelProperty()
  search?: string;
}

@ApiModel({
  name: 'SearchSportsDto',
})
export class SearchSportsDto {
  @ApiModelProperty()
  search: string;

  @ApiModelProperty()
  @IsOptional()
  category_id?: number;

  @ApiModelProperty()
  @IsOptional()
  competition_id?: number;

  @ApiModelProperty()
  @IsOptional()
  game_id?: number;
}
