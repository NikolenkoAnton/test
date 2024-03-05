export const searchGames = {
  path: '/games/search',
  summary: 'Get games id, name by search params',
  description: 'Returns games data',

  parameters: {
    body: {
      model: 'SearchGamesDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SearchGamesResponse' },
  },
};
