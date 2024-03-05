export const searchCategories = {
  path: '/categories/search',
  summary: 'Get categories id, name by search params',
  description: 'Returns categories data',

  parameters: {
    body: {
      model: 'SearchCategoriesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SearchCategoriesResponseDto' },
  },
};
