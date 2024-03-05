import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { CmsFile, CmsImage, StaticPage, StaticPageTemplate, TranslateLanguage } from '../../db/models';
import CmsPage from '../../db/models/CmsPage';
import CmsGeneralSeo from '../../db/models/CmsGeneralSeo';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsEntityExists } from '../custom_validators/is_entity_exists';
import { BOOLEAN_SMALLINT } from '../shared';

@ApiModel({
  name: 'GetGeneralSeoResponseDto',
})
export class GetGeneralSeoResponseDto {
  @ApiModelProperty({
    model: 'CmsGeneralSeo',
  })
  rows: CmsGeneralSeo[];
}

@ApiModel({
  name: 'GetPagesResponseDto',
})
export class GetPagesResponseDto {
  @ApiModelProperty({
    model: 'CmsPage',
    type: SwaggerDefinitionConstant.Model.Type.ARRAY,
    example: [
      {
        id: 27,
        url: 'http://adsasdss.com11',
        values: [
          {
            index: true,
            language: {
              short: 'en',
            },
          },
          {
            index: true,
            language: {
              short: 'en',
            },
          },
        ],
      },
    ],
  })
  rows: CmsPage[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}

@ApiModel({
  name: 'GetPageResponseDto',
})
export class GetPageResponseDto {
  @ApiModelProperty({
    model: 'CmsPage',
  })
  data: CmsPage;
}

@ApiModel({
  name: 'GetPreviousImagesResponseDto',
})
export class GetPreviousImagesResponseDto {
  @ApiModelProperty({
    model: 'CmsImage',
  })
  rows: CmsImage[];
}

@ApiModel({
  name: 'ChoosePreviousImagesResponseDto',
})
export class ChoosePreviousImagesResponseDto {
  @ApiModelProperty({
    model: 'CmsImage',
  })
  rows: CmsImage[];
}

@ApiModel({
  name: 'DeletePreviousImagesResponseDto',
})
export class DeletePreviousImagesResponseDto {
  @ApiModelProperty({
    model: 'CmsImage',
  })
  rows: CmsImage[];
}

@ApiModel({
  name: 'GetStaticPageResponseDto',
})
export class GetStaticPageResponseDto {
  @ApiModelProperty({
    model: 'StaticPage',
  })
  rows: StaticPage[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}

@ApiModel({
  name: 'GetStaticPageTemplateResponseDto',
})
export class GetStaticPageTemplateResponseDto {
  @ApiModelProperty({
    model: 'StaticPageTemplate',
  })
  rows: StaticPageTemplate[];
}

@ApiModel({
  name: 'StaticPageValueTemplateResponseDto',
})
class StaticPageValueTemplateResponseDto {
  @ApiModelProperty()
  name: string;
}

@ApiModel({
  name: 'GetStaticPageValuesResponseDto',
})
export class GetStaticPageValuesResponseDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  slug: string;

  @ApiModelProperty()
  title: string;

  @ApiModelProperty()
  template_id: number;

  @ApiModelProperty()
  active: number;

  @ApiModelProperty({ type: 'string', format: 'date-time' })
  created_at: string;

  @ApiModelProperty({ type: 'string', format: 'date-time' })
  updated_at: string;

  @ApiModelProperty({
    model: 'StaticPageValueTemplateResponseDto',
  })
  template: StaticPageValueTemplateResponseDto;

  @ApiModelProperty({
    model: 'StaticPageValueResponseDto',
  })
  values: StaticPageValueResponseDto[];
}

@ApiModel({
  name: 'StaticPageValueLanguageResponseDto',
})
class StaticPageValueLanguageResponseDto {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  short: string;
}

@ApiModel({
  name: 'StaticPageValueSiteDomainResponseDto',
})
class StaticPageValueSiteDomainResponseDto {
  @ApiModelProperty()
  url: string;
}

@ApiModel({
  name: 'StaticPageValueResponseDto',
})
class StaticPageValueResponseDto {
  @ApiModelProperty()
  cms_page_id: number;

  @ApiModelProperty()
  language_id: number;

  @ApiModelProperty()
  text: string;

  @ApiModelProperty({
    model: 'StaticPageValueLanguageResponseDto',
  })
  language: StaticPageValueLanguageResponseDto;

  @ApiModelProperty({
    model: 'StaticPageValueSiteDomainResponseDto',
  })
  site_domain: StaticPageValueSiteDomainResponseDto;
}

@ApiModel({
  name: 'GetPublicFileResponseDto',
})
export class GetPublicFileResponseDto {
  @ApiModelProperty({
    model: 'CmsFile',
  })
  rows: CmsFile[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}

@ApiModel({
  name: 'OrderSportListDataResponseDto',
})
export class OrderSportListDataResponseDto {
  @ApiModelProperty()
  language_id: number;

  @ApiModelProperty({ model: 'OrderSportListSportResponseDto' })
  sports: OrderSportListSportResponseDto[];
}

@ApiModel({
  name: 'OrderSportListSportResponseDto',
})
class OrderSportListSportResponseDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  position: number;

  @ApiModelProperty()
  favorite: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty({ model: 'OrderSportListCategoriesResponseDto' })
  categories: OrderSportListCategoriesResponseDto[];
}

class OrderSportListCategoriesResponseDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  position: number;

  @ApiModelProperty()
  favorite: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty({ model: 'OrderSportListCompetitionsResponseDto' })
  competitions: OrderSportListCompetitionsResponseDto[];
}

class OrderSportListCompetitionsResponseDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  position: number;

  @ApiModelProperty()
  favorite: number;

  @ApiModelProperty()
  name: string;
}

@ApiModel({
  name: 'OrderSportListResponseDto',
})
export class OrderSportListResponseDto {
  @ApiModelProperty({ model: 'OrderSportListDataResponseDto' })
  data: OrderSportListDataResponseDto;
}
