import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { IsOptional } from 'class-validator';

@ApiModel({
  name: 'SearchGamesDto',
})
export class SearchGamesDto {
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
  competition_id?: number | number[];
}
