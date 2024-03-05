import { BET_RESULTS_ENUM, BET_TYPES_ENUM } from './../../src/helper/bet_constants';
import { ARRAY, BOOLEAN } from '../swagger-type';
import { values } from 'lodash';
import { GetPlayerAnalyticQuery } from '../../src/controller/player/player.request';
import { IApiOperationGetArgs } from 'swagger-express-ts';

export const getBets = {
  path: '/bets',
  summary: 'Get bets data',
  description: 'Returns bets data',

  parameters: {
    body: {
      model: 'GetBetsDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'BetResponse', type: ARRAY },
  },
};

export const getBetTableColumns = {
  path: '/config/presets',
  summary: 'Get bets table columns',
  description: 'Returns bets data',

  responses: {
    200: { description: 'Success', model: 'BetTableColumnsResponse' },
  },
};

export const deleteBetHistoryPresets = {
  path: '/config/presets/delete',

  description: 'Delete bet history presets',
  parameters: {
    query: {
      id: {
        allowEmptyValue: false,
        type: 'number',
      },
    },
  },
  responses: {
    200: { type: BOOLEAN },
  },
};

export const getBetHistoryPresets = {
  path: '/config/presets',
  description: 'Get bet history presets',

  responses: {
    200: { description: 'Success', model: 'BetHistoryPreset', type: ARRAY },
  },
};

export const saveBetHistoryPresets = {
  path: '/config/presets/save',
  summary: 'Save Presets',
  parameters: {
    body: {
      model: 'SaveBetHistoryPresetRequest',
    },
  },
  responses: {
    200: { description: 'Success', model: 'BetTableColumnsResponse' },
  },
};

export const getPlayerStat: IApiOperationGetArgs = {
  path: '/view',

  summary: 'Get player stat by counters',
  responses: {
    200: { model: 'PlayerResponse' },
  },

  parameters: {
    query: {
      id: {
        allowEmptyValue: false,
        type: 'number',
      },
    },
  },
};

export const getPlayerGraphSwagger: IApiOperationGetArgs = {
  path: '/graph',

  summary: 'Get player graph',
  responses: {
    200: { model: 'PlayerGraphResponse', type: ARRAY },
  },
  parameters: {
    query: {
      user_id: {
        allowEmptyValue: false,
        type: 'number',
      },
      sport_ids: {
        allowEmptyValue: true,
        type: 'array',
      },
      category_ids: {
        allowEmptyValue: true,
        type: 'array',
      },
      competition_ids: {
        allowEmptyValue: true,
        type: 'array',
      },

      bet_results: {
        allowEmptyValue: true,
        type: 'array',
        description: `Possible values: ['${values(BET_RESULTS_ENUM).join("','")}']`,
      },
      bet_types: {
        allowEmptyValue: true,
        type: 'array',
        description: `Possible values: ['${values(BET_TYPES_ENUM).join("','")}']`,
      },

      outcome_counts: {
        allowEmptyValue: true,
        type: 'array',
        description: `Possible values: '2/3', '3/3' etc `,
      },

      date_interval: {
        allowEmptyValue: true,
        type: 'array',
        description: `Possible values: {start_date: '2023-01-01', end_date: '2023-02-01'}`,
      },
    },
  },
};

const getPlayerStatQueryParams = {
  parameters: {
    query: {
      user_id: {
        allowEmptyValue: false,
        type: 'number',
        required: true,
      },
      main_tab: {
        allowEmptyValue: true,
        type: 'string',
        description: `Possible values: ['bet_counts','profit','bet_sum','rtp']`,
      },
      order: {
        allowEmptyValue: true,
        description: `Possible values: ['asc','desc']`,
        type: 'string',
      },
    },
  },
};

export const getPlayerStatSports: IApiOperationGetArgs = {
  path: '/events',

  summary: 'Get player stat by events',
  responses: {
    200: { model: 'PlayerStatSportsResponse', type: ARRAY },
  },
  ...getPlayerStatQueryParams,
};

const getPlayerTimeStatQueryParams = {
  parameters: {
    query: {
      id: {
        allowEmptyValue: false,
        type: 'number',
        required: true,
      },
      main_tab: {
        allowEmptyValue: true,
        type: 'string',
        description: `Possible values: ['bet_counts','profit','bet_sum','rtp']`,
      },
      order: {
        allowEmptyValue: true,
        description: `Possible values: ['asc','desc']`,
        type: 'string',
      },
      start_date: {
        allowEmptyValue: true,
        description: `Format: yyyy-MM-dd HH:mm:ss. Example: 2023-08-16T01:13:17.000Z `,
        type: 'string',
      },
      end_date: {
        allowEmptyValue: true,
        description: `Format: yyyy-MM-dd HH:mm:ss. Example: 2023-08-20T01:13:17.000Z `,
        type: 'string',
      },
      chunk_size: {
        allowEmptyValue: true,
        description: `Possible values: ['month','week','day']. By default: 'month'`,
        type: 'string',
      },
    },
  },
};

export const getPlayerStatResults: IApiOperationGetArgs = {
  path: '/results',

  summary: 'Get player stat by results',
  responses: {
    200: { model: 'PlayerStatResultResponse', type: ARRAY },
  },

  ...getPlayerStatQueryParams,
};

export const getPlayerStatTime: IApiOperationGetArgs = {
  path: '/time',

  summary: 'Get player stat by time',
  responses: {
    200: { model: 'PlayerStatTimeResponse', type: ARRAY },
  },

  ...getPlayerTimeStatQueryParams,
};

export const getPlayerStatTypes: IApiOperationGetArgs = {
  path: '/types',

  summary: 'Get player stat by types',
  responses: {
    200: { model: 'PlayerStatTypesResponse', type: ARRAY },
  },

  ...getPlayerStatQueryParams,
};

export const getPlayerAnalyticSwagger: IApiOperationGetArgs = {
  path: '/analytics',

  summary: 'Get player analytics',

  parameters: {
    query: {
      player_id: {
        allowEmptyValue: true,
        type: 'number',
      },
      platform_user_id: {
        allowEmptyValue: true,
        type: 'number',
      },
      page: {
        allowEmptyValue: true,
        type: 'number',
      },
      per_page: {
        allowEmptyValue: true,
        type: 'number',
      },
      min_profit: {
        allowEmptyValue: true,
        type: 'number',
      },
      max_profit: {
        allowEmptyValue: true,
        type: 'number',
      },

      min_bet_count: {
        allowEmptyValue: true,
        type: 'number',
      },
      max_bet_count: {
        allowEmptyValue: true,
        type: 'number',
      },
      min_bet_sum: {
        allowEmptyValue: true,
        type: 'number',
      },
      max_bet_sum: {
        allowEmptyValue: true,
        type: 'number',
      },
      min_rtp: {
        allowEmptyValue: true,
        type: 'number',
      },
      max_rtp: {
        allowEmptyValue: true,
        type: 'number',
      },
      order_by: {
        allowEmptyValue: true,
        type: 'string',
        description: `Possible values: ['bet_counts','profit','bet_sum','rtp']`,
      },
      order_direction: {
        allowEmptyValue: true,
        description: `Possible values: ['asc','desc']`,
        type: 'string',
      },
    },
  },
  responses: {
    200: { model: 'PlayerAnalyticResponse', type: ARRAY },
  },
};
