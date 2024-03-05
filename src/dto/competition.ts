import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsOptional } from 'class-validator';

@ApiModel({
  name: 'SearchCompetitionsDto',
})
export class SearchCompetitionsDto {
  @ApiModelProperty()
  search: string;

  @ApiModelProperty()
  @IsOptional()
  sport_id?: number | number[];

  @ApiModelProperty()
  @IsOptional()
  category_id?: number | number[];

  @ApiModelProperty()
  @IsOptional()
  game_id?: number | number[];
}
