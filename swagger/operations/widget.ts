import { SwaggerDefinitionConstant } from 'swagger-express-ts';

export const getCompetitionTop = {
  path: '/top-competition',
  description: 'Returns top competitions list',
  summary: 'Get top competitions list',

  responses: {
    200: { description: 'Success', model: 'GetCompetitionsTopResponseDto' },
  },
};

export const saveCompetitionTop = {
  path: '/top-competition/save',
  description: 'Creates or updates top competition',
  summary: 'Save/update top competition',

  parameters: {
    body: {
      model: 'UpdateCompetitionTopDto',
    },
    formData: {
      logo: {
        name: 'CompetitionTop logo uploaded',
      },
    },
  },
  responses: {
    200: { description: 'Success:', model: 'UpdateCompetitionTopResponseDto' },
  },
};

export const deleteCompetitionTop = {
  path: '/top-competition/delete',
  description: 'Deletes top competition',
  summary: 'Delete top competition',

  parameters: {
    body: {
      model: 'DeleteCompetitionTopDto',
    },
  },
  responses: {
    200: { description: 'Success: []', type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY },
  },
};

export const getTeaser = {
  path: '/teaser',
  description: 'Returns teasers list',
  summary: 'Get teasers list',

  body: {
    model: 'GetTeaserDto',
  },

  responses: {
    200: { description: 'Success', model: 'GetTeaserResponseDto' },
  },
};

export const saveTeaser = {
  path: '/teaser/save',
  description: 'Creates or updates teaser',
  summary: 'Save/update teaser',

  parameters: {
    body: {
      model: 'UpdateTeaserDto',
    },
    formData: {
      logo: {
        name: 'Teaser logo uploaded',
      },
    },
  },
  responses: {
    200: { description: 'Success:', model: 'UpdateTeaserResponseDto' },
  },
};

export const deleteTeaser = {
  path: '/teaser/delete',
  description: 'Deletes teaser',
  summary: 'Delete teaser',

  parameters: {
    body: {
      model: 'DeleteTeaserDto',
    },
  },
  responses: {
    200: { description: 'Success: []', type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY },
  },
};

export const getMainBannerSlide = {
  path: '/main-banner-slide',
  description: 'Returns main banner slides list',
  summary: 'Get main banner slides list',

  responses: {
    200: { description: 'Success', model: 'GetMainBannerSlidesResponseDto' },
  },
};

export const saveMainBannerSLide = {
  consumes: ['application/json', 'multipart/form-data'],
  path: '/main-banner-slide/save',
  description: 'Creates or updates main banner slide',
  summary: 'Save/update main banner slide',

  parameters: {
    body: {
      model: 'UpdateMainBannerSlideDto',
    },
    formData: {
      image: {
        name: 'MainBannerSlide image uploaded',
      },
    },
  },
  responses: {
    200: { description: 'Success:', model: 'UpdateCompetitionTopResponseDto' },
  },
};

export const deleteMainBannerSlide = {
  path: '/main-banner-slide/delete',
  description: 'Deletes main banner slide',
  summary: 'Delete main banner slide',

  parameters: {
    body: {
      model: 'DeleteMainBannerSlideDto',
    },
  },
  responses: {
    200: { description: 'Success: []', type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY },
  },
};

export const getAllSport = {
  path: '/get-all-event',
  description: 'Returns events list from softswiss',
  summary: 'Get all events',

  responses: {
    200: { description: 'Success', model: 'GetSSSportsResponseDto' },
  },
};

export const getAllCategoryBySport = {
  path: '/get-all-category-by-event',
  description: 'Returns categories list from softswiss by specified event',
  summary: 'Get all categories by event',

  parameters: {
    body: {
      model: 'GetAllCategoriesBySportDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetCategoriesResponseDto' },
  },
};

export const getAllCompetitionByCategory = {
  path: '/get-all-competition-by-category',
  description: 'Returns competitions list from softswiss by specified category',
  summary: 'Get all competitions by category',

  parameters: {
    body: {
      model: 'GetAllCompetitionsByCategoryDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetCompetitionsResponseDto' },
  },
};

export const getAllEventsByCompetition = {
  path: '/get-all-events-by-competition',
  description: 'Returns events list from softswiss by specified competition',
  summary: 'Get all events by competition',

  parameters: {
    body: {
      model: 'GetAllCompetitionsByCategoryDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetEventResponseDto' },
  },
};

export const patchTeasers = {
  path: '/teaser/patchMany',
  description: 'Patch Teasers',
  summary: 'Patch Teasers active and position fields',

  parameters: {
    body: {
      model: 'PatchActiveAndPositionDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const patchCompetitionsTop = {
  path: '/top-competition/patchMany',
  description: 'Patch competitions top',
  summary: 'Patch competitions top active and position fields',

  parameters: {
    body: {
      model: 'PatchActiveAndPositionDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const patchMainBannerSlides = {
  path: '/main-banner-slide/patchMany',
  description: 'Patch main banner slides',
  summary: 'Patch main banner slides active and position fields',

  parameters: {
    body: {
      model: 'PatchActiveAndPositionDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const patchFormBanner = {
  path: '/form-banner-slide/patchMany',
  description: 'Patch Form Banner',
  summary: 'Patch Form Banner active and position fields',

  parameters: {
    body: {
      model: 'PatchActiveAndPositionDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getFormBannerSlide = {
  path: '/form-banner-slide',
  description: 'Returns form banner slides list',
  summary: 'Get form banner slides list',

  parameters: {
    body: {
      model: 'GetMainBannerSlideDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetFormBannerSlideResponseDto' },
  },
};

export const getOneFormBannerSlide = {
  path: '/form-banner-slide/get',
  description: 'Returns form banner slide by id',
  summary: 'Get form banner slide by id',

  parameters: {
    body: {
      model: 'QueryWithId',
    },
  },
  responses: {
    200: { description: 'Success', model: 'FormBannerSlide' },
  },
};

export const saveFormBannerSLide = {
  consumes: ['application/json', 'multipart/form-data'],
  path: '/form-banner-slide/save',
  description: 'Creates or updates form banner slide',
  summary: 'Save/update form banner slide',

  parameters: {
    body: {
      model: 'SaveFormBannerSlideDto',
    },
    formData: {
      image: {
        name: 'FormBanner image uploaded',
        type: 'file',
      },
    },
  },
  responses: {
    200: { description: 'Success:', model: 'UpdateCompetitionTopResponseDto' },
  },
};

export const deleteFormBannerSlide = {
  path: '/form-banner-slide/delete',
  description: 'Deletes form banner slide',
  summary: 'Delete form banner slide',

  parameters: {
    body: {
      model: 'DeleteByIdDto',
    },
  },
  responses: {
    200: { description: 'Success:', model: 'SuccessStatusResponse' },
  },
};

export const deleteExternalBannerSlide = {
  path: '/external-banner-slide/delete',
  description: 'Deletes external banner slide',
  summary: 'Delete external banner slide',
  security: {
    ApiKeyAuth: [],
    basicAuth: [],
  },
  parameters: {
    body: {
      model: 'DeleteByIdDto',
    },
  },
  responses: {
    200: { description: 'Success:', model: 'SuccessStatusResponse' },
  },
};

export const getExternalBannerSlide = {
  path: '/external-banner-slide',
  description: 'Returns external banner slides list',
  summary: 'Get external banner slides list',
  security: {
    ApiKeyAuth: [],
    basicAuth: [],
  },
  parameters: {
    body: {
      model: 'GetMainBannerSlideDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetExternalBannerSlideResponseDto' },
  },
};

export const getOneExternalBannerSlide = {
  path: '/external-banner-slide/get',
  description: 'Returns external banner slide by id',
  summary: 'Get external banner slide by id',
  security: {
    ApiKeyAuth: [],
    basicAuth: [],
  },
  parameters: {
    body: {
      model: 'QueryWithId',
    },
  },
  responses: {
    200: { description: 'Success', model: 'ExternalBannerSlide' },
  },
};

export const saveExternalBannerSLide = {
  path: '/external-banner-slide/save',
  description: 'Creates or updates external banner slide',
  summary: 'Save/update external banner slide',
  security: {
    ApiKeyAuth: [],
    basicAuth: [],
  },
  parameters: {
    body: {
      model: 'SaveExternalBannerSlideDto',
    },
  },
  responses: {
    200: { description: 'Success:', model: 'UpdateCompetitionTopResponseDto' },
  },
};

export const getExternalBannerSlideSizes = {
  path: '/external-banner-slide/sizes',
  description: 'Creates or updates external banner slide sizes',
  summary: 'Save/update external banner slide sizes',
  security: {
    ApiKeyAuth: [],
    basicAuth: [],
  },
  responses: {
    200: {
      description: 'Success:',
      model: 'ExternalBannerSlideSize',
      type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    },
  },
};

export const getExternalBannerSlideTypes = {
  path: '/external-banner-slide/types',
  description: 'Creates or updates external banner slide types',
  summary: 'Save/update external banner slide types',
  security: {
    ApiKeyAuth: [],
    basicAuth: [],
  },
  responses: {
    200: {
      description: 'Success:',
      model: 'ExternalBannerSlideType',
      type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY,
    },
  },
};

export const patchExternalBannerSlide = {
  path: '/external-banner-slide/patchMany',
  description: 'Patch external banner slides',
  summary: 'Patch external banner slides active and position fields',
  security: {
    ApiKeyAuth: [],
    basicAuth: [],
  },
  parameters: {
    body: {
      model: 'PatchActiveAndPositionDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};
