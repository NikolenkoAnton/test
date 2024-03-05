import { ARRAY, DATE_TIME } from '../swagger-type';
import {
  RMT_CATEGORY_SORT,
  RMT_COMPETITION_SORT,
  RMT_MARKET_SORT,
  RMT_TEAM_SORT,
  SORT_DIR,
} from '../../src/helper/constants';

export const getRmtMarket = {
  path: '/market',
  summary: 'Get RMT market data',
  description: 'Get RMT market data',

  parameters: {
    query: {
      sport_ids: {
        required: false,
        allowEmptyValue: false,
        type: ARRAY,
        format: 'number',
      },
      market: {
        description: 'Market name',
        required: false,
        allowEmptyValue: false,
        type: 'string',
      },
      profit_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      profit_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_quantity_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_quantity_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_sum_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_sum_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      rtp_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      rtp_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      active: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      page: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      per_page: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      date_from: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        format: DATE_TIME,
      },
      date_to: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        format: DATE_TIME,
      },
      sort_by: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${RMT_MARKET_SORT}]`,
      },
      sort_dir: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${Object.values(SORT_DIR)}]`,
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetRmtMarketResponseDto' },
  },
};

export const saveRmtMarket = {
  path: '/market/save',
  summary: 'Save RMT market data',
  description: 'Save RMT market data',

  parameters: {
    body: {
      model: 'SaveRmtMarketDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getRmtSportByCompetition = {
  path: '/event-by-competition',
  summary: 'Get RMT event data group by competition',
  parameters: {
    query: {
      competition: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: 'Competition name',
      },
      profit_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      profit_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_quantity_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_quantity_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_sum_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_sum_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      rtp_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      rtp_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      active: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      page: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      per_page: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      date_from: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        format: DATE_TIME,
      },
      date_to: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        format: DATE_TIME,
      },
      sort_by: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${RMT_MARKET_SORT}]`,
      },
      sort_dir: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${Object.values(SORT_DIR)}]`,
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetRmtSportByCategoryResponseDto' },
  },
};

export const getRmtSport = {
  path: '/event',
  summary: 'Get RMT event data',
  parameters: {
    query: {
      sport_ids: {
        required: false,
        allowEmptyValue: false,
        type: ARRAY,
        format: 'number',
      },
      profit_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      profit_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_quantity_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_quantity_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_sum_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_sum_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      rtp_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      rtp_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      active: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      page: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      per_page: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      date_from: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        format: DATE_TIME,
      },
      date_to: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        format: DATE_TIME,
      },
      sort_by: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${RMT_MARKET_SORT}]`,
      },
      sort_dir: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${Object.values(SORT_DIR)}]`,
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetRmtSportResponseDto' },
  },
};

export const saveRmtSport = {
  path: '/event/save',
  summary: 'Save RMT event, category, competition data',

  parameters: {
    body: {
      model: 'SaveRmtSportByCompetitionDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getRmtCategory = {
  path: '/category',
  summary: 'Get RMT category by sport',
  parameters: {
    query: {
      sport_id: {
        allowEmptyValue: true,
        type: 'number',
      },
      sort_by: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${RMT_CATEGORY_SORT}]`,
      },
      sort_dir: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${Object.values(SORT_DIR)}]`,
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetRmtCategoryResponseDto', type: ARRAY },
  },
};

export const getRmtCompetition = {
  path: '/competition',
  summary: 'Get RMT competition by category',
  parameters: {
    query: {
      category_id: {
        allowEmptyValue: true,
        type: 'number',
      },
      sort_by: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${RMT_COMPETITION_SORT}]`,
      },
      sort_dir: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${Object.values(SORT_DIR)}]`,
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetRmtCompetitionResponseDto', type: ARRAY },
  },
};

export const saveRmtBaseSettings = {
  path: '/base-settings/save',
  summary: 'Save RMT base settings',

  parameters: {
    body: {
      model: 'SaveRmtBaseSettingsDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getRmtBaseSettings = {
  path: '/base-settings',
  summary: 'Get RMT base settings',
  responses: {
    200: { description: 'Success', model: 'RMTBaseSettings' },
  },
};

export const saveRmtPlayer = {
  path: '/player/save',
  summary: 'Save RMT player',

  parameters: {
    body: {
      model: 'SaveRmtPlayerDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getRmtPlayer = {
  path: '/player',
  summary: 'Get RMT player',
  responses: {
    200: { description: 'Success', model: 'SaveRmtPlayerDto' },
  },
};

export const saveRmtPlayerRtp = {
  path: '/player-rtp/save',
  summary: 'Save RMT player theoretical rtp',

  parameters: {
    body: {
      model: 'SaveRmtPlayerRtpDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};

export const getRmtPlayerRtp = {
  path: '/player-rtp',
  summary: 'Get RMT player theoretical rtp',
  responses: {
    200: { description: 'Success', model: 'SaveRmtPlayerRtpDto' },
  },
};

export const getRmtTeam = {
  path: '/team',
  summary: 'Get RMT team data',
  description: 'Get RMT team data',

  parameters: {
    query: {
      sport_ids: {
        required: false,
        allowEmptyValue: false,
        type: ARRAY,
        format: 'number',
      },
      team: {
        description: 'Team name (min. 1 symbol)',
        required: false,
        allowEmptyValue: false,
        type: 'string',
      },
      profit_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      profit_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_quantity_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_quantity_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_sum_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      bet_sum_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      rtp_min: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      rtp_max: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      active: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      page: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      per_page: {
        required: false,
        allowEmptyValue: false,
        type: 'number',
      },
      date_from: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        format: DATE_TIME,
      },
      date_to: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        format: DATE_TIME,
      },
      sort_by: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${RMT_TEAM_SORT}]`,
      },
      sort_dir: {
        required: false,
        allowEmptyValue: false,
        type: 'string',
        description: `Possible values: [${Object.values(SORT_DIR)}]`,
      },
    },
  },
  responses: {
    200: { description: 'Success', model: 'GetRmtTeamResponseDto' },
  },
};

export const saveRmtTeam = {
  path: '/team/save',
  summary: 'Save RMT team',

  parameters: {
    body: {
      model: 'SaveRmtTeamDto',
    },
  },
  responses: {
    200: { description: 'Success', model: 'SuccessStatusResponse' },
  },
};
