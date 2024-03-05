import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import config from '../../config';

@ApiModel({
  name: 'NoteSaveRequest',
})
export class NoteSaveRequest {
  @ApiModelProperty()
  @IsString()
  path: string;

  @ApiModelProperty()
  @IsString()
  @Transform((value) => value.replace(/<\/?[^>]+(>|$)/g, ''))
  @MaxLength(700)
  text: string;
}

@ApiModel()
export class GetNoteRequest {
  @ApiModelProperty()
  @IsOptional()
  path: string;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  page = 1;

  @ApiModelProperty()
  @IsOptional()
  @Type(() => Number)
  per_page? = config.DEFAULT_PAGINATION_SIZE;
}

@ApiModel()
export class GetUnreadNotesCountRequest {
  @ApiModelProperty()
  @IsOptional()
  path: string;
}
