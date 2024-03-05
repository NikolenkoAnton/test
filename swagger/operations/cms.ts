import { SwaggerDefinitionConstant } from 'swagger-express-ts';

export const getGeneralSeo = {
  path: '/general-seo',
  description: 'Returns cms general pages settings',
  summary: 'Get cms general pages settings list',

  responses: {
    200: { description: 'Success', model: 'GetGeneralSeoResponseDto' },
  },
};

export const saveGeneralSeo = {
  path: '/general-seo/save',
  description: 'Create or save cms general pages settings',
  summary: 'Create or save cms general pages settings',

  parameters: {
    body: {
      model: 'SaveGeneralSeoDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const saveStaticPage = {
  path: '/static-page/save',
  description: 'Create or save static page',
  summary: 'Create or save static page',

  parameters: {
    body: {
      model: 'SaveStaticPageDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getPages = {
  path: '/pages',
  description: 'Returns cms pages list',
  summary: 'Get cms pages list',

  parameters: {
    body: {
      model: 'GetPagesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetPagesResponseDto' },
  },
};

export const getPage = {
  path: '/pages/get',
  description: 'Returns cms page data by id',
  summary: 'Get cms page data by id',

  parameters: {
    body: {
      model: 'GetPageDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'CmsPage' },
  },
};

export const getStaticPage = {
  path: '/static-page',
  description: 'Returns static pages',
  summary: 'Get static pages basic content',

  parameters: {
    body: {
      model: 'GetStaticPageDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetStaticPageResponseDto' },
  },
};

export const getOneStaticPage = {
  path: '/static-page/get',
  description: 'Returns one static page by id',
  summary: 'Get static page content',

  parameters: {
    query: {
      id: {
        allowEmptyValue: false,
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'StaticPage' },
  },
};

export const patchStaticPage = {
  path: '/static-page/patchMany',
  description: 'Patch static pages',
  summary: 'Patch static pages active and position fields',

  parameters: {
    body: {
      model: 'PatchActiveDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getStaticPageValues = {
  path: '/static-page/values',
  description: 'Returns static page values',
  summary: 'Get static page content on different languages',

  parameters: {
    body: {
      model: 'GetStaticPageValuesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetStaticPageValuesResponseDto' },
  },
};

export const getStaticPageTemplate = {
  path: '/static-page/template',
  description: 'Returns static pages templates',
  summary: 'Get static pages templates',

  responses: {
    200: { description: 'Success', model: 'GetStaticPageResponseDto' },
  },
};

export const savePage = {
  path: '/pages/save',
  description: 'Create or save cms page data',
  summary: 'Create or save cms page data',

  parameters: {
    body: {
      model: 'SavePageDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const deletePage = {
  path: '/pages/delete',
  description: 'Delete cms page data',
  summary: 'Delete cms page data',

  parameters: {
    body: {
      model: 'DeletePageDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const deleteStaticPage = {
  path: '/static-page/delete',
  description: 'Delete static page data',
  summary: 'Delete static page data',

  parameters: {
    body: {
      model: 'DeleteStaticPageDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getPreviousImages = {
  path: '/previous-images',
  description: 'Returns previous images list',
  summary: 'Get previous images list',

  parameters: {
    body: {
      model: 'GetPreviousImagesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetPreviousImagesResponseDto' },
  },
};

export const choosePreviousImages = {
  path: '/previous-images/choose',
  description: 'Choose cms image item',
  summary: 'Choose cms image item from cms image',

  parameters: {
    body: {
      model: 'ChoosePreviousImagesDto',
    },
  },
  responses: {
    200: { description: 'Success: []', type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY },
  },
};

export const choosePreviousImagesMultipleRecords = {
  path: '/previous-images/choose-multiple-records',
  description: 'Choose cms image items for multiple records',
  summary: 'same as /previous-images/choose, but with array as input param',
  parameters: {
    body: {
      model: 'ChoosePreviousImagesMultipleRecordsDto',
    },
  },
  responses: {
    200: { description: 'Success: []', type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY },
  },
};

export const choosePreviousImagesValues = {
  path: '/previous-images/choose-multiple',
  description: 'Relate cms image item',
  summary: 'Relate cms image item from cms image',

  parameters: {
    body: {
      model: 'ChoosePreviousImagesValuesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const deletePreviousImages = {
  path: '/previous-images/delete',
  description: 'Deletes cms image',
  summary: 'Delete cms image',

  parameters: {
    body: {
      model: 'DeletePreviousImagesDto',
    },
  },
  responses: {
    200: { description: 'Success: []', type: SwaggerDefinitionConstant.Model.Property.Type.ARRAY },
  },
};

export const getCmsPublicFile = {
  path: '/public-file',
  description: 'Returns cms public files',
  parameters: {
    body: {
      model: 'GetPagesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetPublicFileResponseDto' },
  },
};

export const saveCmsPublicFile = {
  consumes: ['application/json', 'multipart/form-data'],
  path: '/public-file/save',
  description: 'Create cms public file',
  parameters: {
    body: {
      model: 'SaveCmsFile',
    },
    formData: {
      file: {
        name: 'file',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const deleteCmsPublicFile = {
  path: '/public-file/delete',
  description: 'Delete cms public file',

  parameters: {
    body: {
      model: 'DeletePageDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getCmsSportList = {
  path: '/event-list',
  description: 'Returns cms event list for widget',
  parameters: {
    query: {
      sport_id: {
        type: 'number',
        optional: true,
      },
      category_id: {
        type: 'number',
        optional: true,
      },
      competition_id: {
        type: 'number',
        optional: true,
      },
      language_id: {
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'OrderSportListResponseDto' },
  },
};

export const orderCmsSportList = {
  path: '/event-list/save',
  description: 'Order cms event list for widget',
  parameters: {
    body: {
      model: 'OrderSportListDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};
