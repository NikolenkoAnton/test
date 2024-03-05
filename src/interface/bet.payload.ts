interface GeneralBetHistoryPayload {
  bet_counts?: number;
  profit?: number;
  bet_sum?: number;
  rtp?: number;

  win_sum?: number;
  stake_sum?: number;
}

export interface BetHistoryTypesPayload extends GeneralBetHistoryPayload {
  type: string;

  outcome_counts: string;
}
