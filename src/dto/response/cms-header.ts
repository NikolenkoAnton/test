import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import TranslateLanguage from '../../db/models/TranslateLanguage';
import SiteDomain from '../../db/models/SiteDomain';

@ApiModel({
  name: 'CmsHeaderBlockResponse',
})
export class CmsHeaderBlockResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  position: number;

  @ApiModelProperty()
  active: number;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty({ model: 'CmsHeaderBlockValueResponse' })
  @Type(() => CmsHeaderBlockValueResponse)
  values: Partial<CmsHeaderBlockValueResponse>[];
}

@ApiModel({
  name: 'CmsHeaderBlockValueResponse',
})
export class CmsHeaderBlockValueResponse {
  @ApiModelProperty()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiModelProperty()
  cms_footer_group_id: number;

  @ApiModelProperty()
  language_id: number;

  @ApiModelProperty()
  site_domain_id: number;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty({
    model: 'TranslateLanguage',
  })
  language: TranslateLanguage;

  @ApiModelProperty({
    model: 'SiteDomain',
  })
  site_domain: SiteDomain;
}
