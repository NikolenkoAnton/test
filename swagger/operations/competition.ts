export const searchCompetitions = {
  path: '/competitions/search',
  summary: 'Get competitions id, name by search params',
  description: 'Returns competitions data',

  parameters: {
    body: {
      model: 'SearchCompetitionsDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SearchCompetitionsResponse' },
  },
};
