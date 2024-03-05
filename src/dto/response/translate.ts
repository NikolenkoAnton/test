import { SiteDomainResponse, TranslateLanguageResponse } from './shared';
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { TranslateKeyValue } from '../../db/models';

@ApiModel({
  name: 'TranslateKeyResponse',
})
export class TranslateKeyResponse {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty()
  key: string;
  @ApiModelProperty()
  group: string;
  @ApiModelProperty()
  description: string;
  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    example: ['en', 'ru'],
  })
  languages: string[];

  @ApiModelProperty({
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
  })
  text_values: TranslateKeyValue[];
}

@ApiModel({
  name: 'TranslateKeyValueResponse',
})
export class TranslateKeyValueResponse {
  @ApiModelProperty()
  id?: number;

  @ApiModelProperty({ model: 'TranslateLanguageResponse' })
  language: TranslateLanguageResponse;

  @ApiModelProperty({ model: 'SiteDomainResponse' })
  site_domain: SiteDomainResponse;

  @ApiModelProperty()
  value: string;
}

@ApiModel({
  name: 'GetTranslateKeyValuesResponse',
})
export class GetTranslateKeyValuesResponse {
  @ApiModelProperty()
  key_id: number;
  @ApiModelProperty({
    model: 'TranslateKeyValueResponse',
    type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
  })
  values: TranslateKeyValueResponse[];
}
