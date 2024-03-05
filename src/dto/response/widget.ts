import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { PaginationResponse } from './pagination';
import { CompetitionTop, ExternalBanner, FormBanner, MainBannerSlide, Teaser } from '../../db/models';
import { IsNumber } from 'class-validator';

@ApiModel({
  name: 'GetCompetitionsTopResponseDto',
  description: 'Response of top competitions list',
})
export class GetCompetitionsTopResponseDto extends PaginationResponse<Omit<CompetitionTop, 'text_values'>> {
  @ApiModelProperty({
    model: 'CompetitionTop',
  })
  rows;
}

@ApiModel({
  name: 'GetTeaserResponseDto',
  description: 'Response of teaser list',
})
export class GetTeaserResponseDto extends PaginationResponse<Teaser> {
  @ApiModelProperty({
    model: 'Teaser',
  })
  rows: Teaser[];
}

@ApiModel({
  name: 'GetMainBannerSlidesResponseDto',
  description: 'Response of main banner slides list',
})
export class GetMainBannerSlidesResponseDto extends PaginationResponse<MainBannerSlide> {
  @ApiModelProperty({
    model: 'MainBannerSlide',
  })
  rows: MainBannerSlide[];
}

@ApiModel({
  name: 'UpdateCompetitionTopResponseDto',
})
export class UpdateCompetitionTopResponseDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'UpdateTeaserResponseDto',
})
export class UpdateTeaserResponseDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'UpdateMainBannerResponseDto',
})
export class UpdateMainBannerResponseDto {
  @ApiModelProperty()
  @IsNumber()
  id: number;
}

@ApiModel({
  name: 'GetFormBannerSlideResponseDto',
  description: 'Response of top competitions list',
})
export class GetFormBannerSlideResponseDto {
  @ApiModelProperty({
    model: 'FormBanner',
  })
  rows: FormBanner[];

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
  name: 'GetExternalBannerSlideResponseDto',
  description: 'Response of external banner slide list',
})
export class GetExternalBannerSlideResponseDto {
  @ApiModelProperty({
    model: 'ExternalBannerSlide',
  })
  rows: ExternalBanner[];

  @ApiModelProperty({
    description: 'Total pages',
  })
  pages?: number;

  @ApiModelProperty({
    description: 'Current page',
  })
  current_page?: number;
}
