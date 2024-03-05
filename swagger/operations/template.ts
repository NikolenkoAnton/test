export const getMarkets = {
  path: '/markets',
  description: 'Returns markets populated with sport name and template view data',
  summary: 'Get markets list',

  parameters: {
    body: {
      model: 'GetMarketsDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetMarketsResponseDto' },
  },
};

export const searchMarkets = {
  path: '/markets/search',
  description: 'Returns markets where ID or name iLike search value',
  summary: 'Get markets list',

  parameters: {
    body: {
      model: 'SearchMarketsDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SearchMarketsResponseDto' },
  },
};

export const getTemplates = {
  path: '/templates',
  description: 'Returns template views data populated with template view columns data',
  summary: 'Get templates list',

  responses: {
    200: { description: 'Success', model: 'SwaggerTemplatesResponseDto' },
  },
};

export const saveMarket = {
  path: '/markets/save',
  description: 'Saves or updates or deletes market',
  summary: 'Save/update/delete market',

  parameters: {
    body: {
      model: 'UpdateMarketDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'ErrorResponseDto' },
  },
};
