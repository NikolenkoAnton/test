export const getCurrencies = {
  path: '/currencies',
  summary: 'Get currencies data',
  description: 'Returns currencies data',

  responses: {
    200: { description: 'Success', model: 'GetCurrenciesResponseDto' },
  },
};
