export const saveDomain = {
  consumes: ['application/json', 'multipart/form-data'],
  path: '/domain/save',
  summary: 'Save domain',
  description: 'Save domain record',

  parameters: {
    body: {
      model: 'SaveSiteDomainDto',
    },
    formData: {
      big_logo_image: {
        name: 'big_logo_image',
      },
      small_logo_image: {
        name: 'small_logo_image',
      },
      favicon_image: {
        name: 'favicon_image',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'SiteDomain' },
  },
};

export const addDomain = {
  consumes: ['application/json', 'multipart/form-data'],
  path: '/domain/add',
  summary: 'Add domain',
  description: 'Add domain record',

  parameters: {
    body: {
      model: 'AddSiteDomainDto',
    },
    formData: {
      big_logo_image: {
        name: 'big_logo_image',
      },
      small_logo_image: {
        name: 'small_logo_image',
      },
      favicon_image: {
        name: 'favicon_image',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'SiteDomain' },
  },
};

export const getDomains = {
  path: '/domain',
  summary: 'Get domain',
  description: 'Get domain records',

  responses: {
    200: { description: 'Success', model: 'GetDomainsResponseDto' },
  },
};

export const removeDomain = {
  path: '/domain/delete',
  summary: 'Remove domain',
  description: 'Remove domain record',
  parameters: {
    query: {
      id: {
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};
