import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
  name: 'CmsHeaderBlockValueRequest',
})
export class CmsHeaderBlockValueRequest {
  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  cms_header_block_id?: number;

  @ApiModelProperty()
  @IsNumber()
  language_id: number;

  @ApiModelProperty()
  @IsNumber()
  site_domain_id: number;

  @ApiModelProperty()
  @IsString()
  title: string;
}

@ApiModel({
  name: 'CmsHeaderBlockRequest',
})
export class CmsHeaderBlockRequest {
  @ApiModelProperty()
  @IsNumber()
  id: number;

  @ApiModelProperty({ model: 'CmsHeaderBlockValueRequest' })
  @ValidateNested({ each: true })
  @Type(() => CmsHeaderBlockValueRequest)
  @IsArray()
  values: CmsHeaderBlockValueRequest[];
}
