import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsOptional } from 'class-validator';

@ApiModel({
  name: 'SearchCategoriesDto',
})
export class SearchCategoriesDto {
  @ApiModelProperty()
  search: string;

  @ApiModelProperty()
  @IsOptional()
  sport_id?: number | number[];

  @ApiModelProperty()
  @IsOptional()
  competition_id?: number | number[];

  @ApiModelProperty()
  @IsOptional()
  game_id?: number | number[];
}
