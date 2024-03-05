import { Type } from 'class-transformer';
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { SiteDomainResponse, TranslateLanguageResponse } from './shared';
import CmsFooterLogo from '../../db/models/CmsFooterLogo';
import { CmsFooterChat, CmsFooterText, CmsFooterValidator } from '../../db/models';

@ApiModel({
  name: 'CmsFooterBlockTypeResponse',
})
export class CmsFooterBlockTypeResponse {
  @ApiModelProperty({ example: 1 })
  id: number;

  @ApiModelProperty({ example: 'default type' })
  name: string;
}

@ApiModel({
  name: 'CmsFooterGroupElementValueResponse',
})
export class CmsFooterGroupElementValueResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  cms_footer_group_element_id: number;

  @ApiModelProperty()
  language_id: number;

  @ApiModelProperty()
  site_domain_id: number;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty()
  url?: string;

  @Type(() => TranslateLanguageResponse)
  @ApiModelProperty({ model: 'TranslateLanguageResponse' })
  language: TranslateLanguageResponse;

  @Type(() => SiteDomainResponse)
  @ApiModelProperty({ model: 'SiteDomainResponse' })
  site_domain: SiteDomainResponse;
}

@ApiModel({
  name: 'CmsFooterGroupElementResponse',
})
export class CmsFooterGroupElementResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  cms_footer_group_id: number;

  @ApiModelProperty()
  position: number;

  @ApiModelProperty()
  active: number;

  @ApiModelProperty({ model: 'CmsFooterGroupElementValueResponse' })
  values: CmsFooterGroupElementValueResponse[];
}

@ApiModel({
  name: 'CmsFooterGroupValueResponse',
})
export class CmsFooterGroupValueResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  cms_footer_group_id: number;

  @ApiModelProperty()
  language_id: number;

  @ApiModelProperty()
  site_domain_id: number;

  @ApiModelProperty()
  title: string;

  @Type(() => TranslateLanguageResponse)
  @ApiModelProperty({ model: 'TranslateLanguageResponse' })
  language: TranslateLanguageResponse;

  @Type(() => SiteDomainResponse)
  @ApiModelProperty({ model: 'SiteDomainResponse' })
  site_domain: SiteDomainResponse;
}
@ApiModel({
  name: 'CmsFooterBlockResponse',
})
export class CmsFooterBlockResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  cms_footer_block_type_id: number;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty()
  position: number;

  @ApiModelProperty()
  active: number;

  @ApiModelProperty({ model: 'CmsFooterBlockTypeResponse' })
  @Type(() => CmsFooterBlockTypeResponse)
  type: CmsFooterBlockTypeResponse;

  @ApiModelProperty({ model: 'CmsFooterGroupResponse' })
  @Type(() => CmsFooterGroupResponse)
  groups: Partial<CmsFooterGroupResponse>[];
}

@ApiModel({
  name: 'CmsFooterGroupResponse',
})
export class CmsFooterGroupResponse {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  cms_footer_block_id: number;

  @ApiModelProperty()
  position: number;

  @ApiModelProperty()
  active: number;

  @ApiModelProperty({ model: 'CmsFooterGroupValueResponse' })
  @Type(() => CmsFooterGroupValueResponse)
  values: Partial<CmsFooterGroupValueResponse>[];

  @ApiModelProperty({ model: 'CmsFooterGroupElementResponse' })
  @Type(() => CmsFooterGroupElementResponse)
  elements: CmsFooterGroupElementResponse[];
}

@ApiModel({
  name: 'GetCmsFooterTextResponseDto',
})
export class GetCmsFooterTextResponseDto {
  @ApiModelProperty()
  id: number;

  @Type(() => CmsFooterText)
  @ApiModelProperty({ model: 'CmsFooterText' })
  values: CmsFooterText[];
}

@ApiModel({
  name: 'GetCmsFooterLogoResponseDto',
})
export class GetCmsFooterLogoResponseDto {
  @ApiModelProperty()
  id: number;

  @Type(() => CmsFooterLogo)
  @ApiModelProperty({ model: 'CmsFooterLogo' })
  values: CmsFooterLogo[];
}

@ApiModel({
  name: 'GetCmsFooterChatResponseDto',
})
export class GetCmsFooterChatResponseDto {
  @ApiModelProperty()
  id: number;

  @Type(() => CmsFooterLogo)
  @ApiModelProperty({ model: 'CmsFooterLogo' })
  values: CmsFooterChat[];
}

@ApiModel({
  name: 'GetCmsFooterValidatorResponseDto',
})
export class GetCmsFooterValidatorResponseDto {
  @ApiModelProperty()
  id: number;

  @Type(() => CmsFooterText)
  @ApiModelProperty({ model: 'CmsFooterValidator' })
  values: CmsFooterValidator[];
}
