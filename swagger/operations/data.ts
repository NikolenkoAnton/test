import { ARRAY } from '../swagger-type';

export const getSports = {
  path: '/event',
  summary: 'Get events data',
  description: 'Returns events data',

  parameters: {
    body: {
      model: 'GetSportsDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetSportsResponseDto' },
  },
};

export const searchSports = {
  path: '/event/search',
  summary: 'Get events id, name by search params',
  description: 'Returns events data',

  parameters: {
    body: {
      model: 'SearchSportsDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SearchSportsResponseDto' },
  },
};

export const getCountries = {
  path: '/country',
  summary: 'Get countries',
  description: 'Returns countries data',
  responses: {
    200: { description: 'Success', model: 'Country', type: ARRAY },
  },
};

export const getShortSport = {
  path: '/event-short',
  summary: 'Get short events',
  description: 'Returns name and id of events',
  responses: {
    200: { description: 'Success', model: 'SearchSportsResponseDto', type: ARRAY },
  },
};

export const getShortCategory = {
  path: '/category-short',
  summary: 'Get short category',
  description: 'Returns name and id of categories',
  parameters: {
    query: {
      event_id: {
        allowEmptyValue: false,
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'SearchSportsResponseDto', type: ARRAY },
  },
};

export const getShortCompetition = {
  path: '/competition-short',
  summary: 'Get short competition',
  description: 'Returns name and id of competitions',
  parameters: {
    query: {
      category_id: {
        allowEmptyValue: false,
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'SearchSportsResponseDto', type: ARRAY },
  },
};

export const getShortEvent = {
  path: '/event-short',
  summary: 'Get short event',
  description: 'Returns name and id of events',
  parameters: {
    query: {
      competition_id: {
        allowEmptyValue: false,
        type: 'number',
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'SearchSportsResponseDto', type: ARRAY },
  },
};
