export enum PLAYER_VIEW_MAIN_TABS {
  BET_COUNTS = 'bet_counts',
  PROFIT = 'profit',
  BET_SUM = 'bet_sum',
  RTP = 'rtp',
}

export enum PLAYER_TIME_CHUNK_TYPES {
  MONTH = 'month',
  WEEK = 'week',
  DAY = 'day',
}
export const PLAYER_TIME_CHUNK_INTERVAL = {
  [PLAYER_TIME_CHUNK_TYPES.MONTH]: '28 days',
  [PLAYER_TIME_CHUNK_TYPES.WEEK]: '7 days',
  [PLAYER_TIME_CHUNK_TYPES.DAY]: '1 day',
};
