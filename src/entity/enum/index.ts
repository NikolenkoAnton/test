export enum FixtureStatus {
  NOT_SET = 0,
  NOT_STARTED = 1,
  IN_PROGRESS = 2,
  FINISHED = 3,
  CANCELED = 4,
  POSTPONED = 5,
  INTERRUPTED = 6,
  ABANDONED = 7,
  COVERAGE_LOST = 8,
  ABOUT_TO_START = 9,
}

export enum SubscriptionType {
  IN_PLAY = 1,
  PRE_MATCH = 2,
}

export enum SubscriptionStatus {
  NOT_SET = 0,
  SUBSCRIBED = 1,
  PENDING = 2,
  UNSUBSCRIBED = 3,
  DELETED = 4,
}

export enum BetSettlement {
  CANCELED = -1, // The bet settlement is canceled
  NOT_SETTLED = 0,
  LOSER = 1, // The bet has lost
  WINNER = 2, // The bet has won
  REFUND = 3, // There should be a refund
  HALF_LOST = 4, // Half of the bet has lost
  HALF_WON = 5, // Half of the bet has won
}

export enum BetStatus {
  NOT_SET = 0,
  OPEN = 1, // The bet is open (bets can be placed)
  SUSPENDED = 2, // The bet is suspended (bets cannot be placed)
  SETTLED = 3, // The bet is settled (resulted) – a settlement is determined (see settlement enumeration for additional information)
}

export enum StatusDescription {
  NONE = 0,
  HT = 1,
  OTHT = 2,
  HOME_RETIRED = 3,
  AWAY_RETIRED = 4,
  LOST_COVERAGE = 5,
  MEDICAL_TIMEOUT = 6,
  TIMEOUT_HOME_TEAM = 7,
  TIMEOUT_AWAY_TEAM = 8,
  TIMEOUT = 9,
  HOME_WALKOVER = 10,
  AWAY_WALKOVER = 11,
}

export enum StatisticType {
  NOT_SET = 0,
  CORNERS = 1,
  SHOTS_ON_TARGET = 2,
  SHOTS_OFF_TARGET = 3,
  ATTACKS = 4,
  DANGEROUS_ATTACKS = 5,
  YELLOW_CARD = 6,
  RED_CARD = 7,
  PENALTIES = 8,
  GOAL = 9,
  SUBSTITUTIONS = 10,
  POSSESSION = 11,
  FOULS = 12,
  FREE_KICKS = 13,
  GOAL_KICKS = 14,
  OFFSIDES = 15,
  BLOCKED_SHOTS = 16,
  THROW_INS = 17,
  WOODWORK_SHOTS = 18,
  CLEARANCE = 19,
  ACES = 20,
  DOUBLE_FAULTS = 21,
  SERVICE_POINTS = 22,
  BREAK_POINTS = 23,
  OWN_GOAL = 24,
  PENALTY_GOAL = 25,
  SCORE = 27,
  TWO_POINTS = 28,
  PCT = 29,
  THREE_POINTS = 30,
  TIME_OUTS = 31,
  FREE_THROWS = 32,
  HITS = 33,
  FIRST_SERVE_WINS = 34,
  BALL = 35,
  WICKET_TAKEN = 36,
  WIDE_BALL = 37,
  NO_BALL = 38,
  LEG_BYE = 39,
  MISSED_PENALTY = 40,
  CARDS = 41,
}

export enum OutrightFixtureLeagueType {
  LEAGUE = 3,
  SEASON = 4,
}
