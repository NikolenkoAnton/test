export enum BET_RESULTS_ENUM {
  IN_PROGRESS = 'in_progress',
  WIN = 'win',
  LOSE = 'loss',
  REFUND = 'refund',
  CANCEL = 'void',
  PART_LOSS = 'part_loss',
  PART_WIN = 'part_win',
}
export enum BET_RESULTS_SS_ENUM {
  NO_RESULTS = 'no_results',
  WIN = 'win',
  LOSE = 'lose',
  REFUND = 'refund',
  CANCEL = 'cancel',
}
export enum BET_TYPES_SS_ENUM {
  SINGLE = 'single',
  COMBO = 'combo',
  SYSTEM = 'system',
}

export enum BET_TYPES_ENUM {
  SINGLE = 'single',
  COMBO = 'combo',
  SYSTEM = 'system',
}

export enum OUTCOME_STATUSES_SS_ENUM {
  NO_RESULTS = 'no_results',
  CANCEL = 'canceled',
  WIN_ENTIRE = 'win_entire',
  LOSE_ENTIRE = 'lose_entire',
  REFUND_ENTIRE = 'refund_entire',
  REFUND_HALF_WIN_OTHER = 'refund_half_win_other',
  REFUND_HALF_LOSE_OTHER = 'refund_half_lose_other',
}

export enum OUTCOME_STATUSES_ENUM {
  // IN_PROGRESS = 'in_progress',
  VOID = 'void',
  WIN = 'win',
  LOSS = 'loss',
  REFUND = 'refund',
  WIN_REFUND = 'win_refund',
  LOSS_REFUND = 'loss_refund',
  CANCEL = 'cancel',
}
