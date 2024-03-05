import { assign, every, filter, includes } from 'lodash';

import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import {
  OUTCOME_STATUSES_SS_ENUM,
  OUTCOME_STATUSES_ENUM,
  BET_TYPES_SS_ENUM,
  BET_TYPES_ENUM,
  BET_RESULTS_ENUM,
  BET_RESULTS_SS_ENUM,
} from '../../helper/bet_constants';

@ApiModel({
  name: 'SoftswissSport',
  description: 'Sport object from softswisss',
})
export class Sport {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  urn_id: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  key: string;

  @ApiModelProperty()
  type: string;

  @ApiModelProperty()
  priority: number;

  @ApiModelProperty()
  main_market_id: number;

  @ApiModelProperty()
  main_market_outcomes_count: number;

  @ApiModelProperty()
  secondary_market_id: number;

  @ApiModelProperty()
  secondary_market_outcomes_count: number;
}

@ApiModel({
  name: 'SoftswissCategory',
  description: 'Category object from softswisss',
})
export class Category {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  urn_id: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  country_code: string;

  @ApiModelProperty()
  sport_id: number;

  @ApiModelProperty()
  sport_urn_id: string;

  @ApiModelProperty()
  sport_key: string;

  @ApiModelProperty()
  sport_name: string;

  @ApiModelProperty()
  sport_type: string;

  @ApiModelProperty()
  priority: number;

  @ApiModelProperty()
  slug: string;
}

@ApiModel({
  name: 'SoftswissCompetition',
  description: 'Competition object from softswisss',
})
export class Competition {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  urn_id: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  priority: number;

  @ApiModelProperty({
    model: 'SoftswissSport',
  })
  sport: Sport;

  @ApiModelProperty({
    model: 'SoftswissCategory',
  })
  category: Category;

  @ApiModelProperty()
  slug: string;
}

@ApiModel({
  name: 'CompetitorModel',
})
class CompetitorModel {
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  logo: string;
}

@ApiModel({
  name: 'CompetitorsModel',
})
class CompetitorsModel {
  @ApiModelProperty({
    model: 'CompetitorModel',
  })
  home: CompetitorModel;

  @ApiModelProperty({
    model: 'CompetitorModel',
  })
  away: CompetitorModel;
}

@ApiModel({
  name: 'TournamentModel',
})
class TournamentModel {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  urn_id: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  priority: number;

  @ApiModelProperty({
    model: 'Sport',
  })
  sport: Sport;

  @ApiModelProperty({
    model: 'Category',
  })
  category: Category;

  @ApiModelProperty()
  slug: string;
}

@ApiModel({
  name: 'ScoreModel',
})
class ScoreModel {
  @ApiModelProperty()
  home: number;

  @ApiModelProperty()
  away: number;
}

@ApiModel({
  name: 'PeriodScoreModel',
})
class PeriodScoreModel extends ScoreModel {
  @ApiModelProperty()
  period_key: string;

  @ApiModelProperty()
  period_name: string;

  @ApiModelProperty()
  number: number;

  @ApiModelProperty()
  type: string;
}

@ApiModel({
  name: 'StatisticsModel',
})
class StatisticsModel {
  @ApiModelProperty()
  clock?: any; // not used yet

  @ApiModelProperty({
    model: 'ScoreModel',
  })
  total_score: ScoreModel;

  @ApiModelProperty({
    model: 'PeriodScoreModel',
  })
  period_score: PeriodScoreModel[];

  @ApiModelProperty({
    model: 'ScoreModel',
  })
  game_score?: ScoreModel;

  @ApiModelProperty()
  max_period_number?: number;

  @ApiModelProperty()
  current_server?: any; // not used yet
}

@ApiModel({
  name: 'SoftswissEvent',
  description: 'Event object from softswisss',
})
export class Event {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  urn_id: string;

  @ApiModelProperty()
  start_time: string;

  @ApiModelProperty()
  end_date: string;

  @ApiModelProperty()
  status: number;

  @ApiModelProperty()
  type: string;

  @ApiModelProperty()
  stage: string;

  @ApiModelProperty({
    model: 'CompetitorsModel',
  })
  competitors: CompetitorsModel;

  @ApiModelProperty({
    model: 'TournamentModel',
  })
  tournament: TournamentModel;

  @ApiModelProperty({
    model: 'StatisticsModel',
  })
  statistics: StatisticsModel;

  @ApiModelProperty()
  stadium: string;

  @ApiModelProperty()
  city: string;

  @ApiModelProperty()
  slug: string;

  @ApiModelProperty()
  available_markets: number;

  @ApiModelProperty()
  top_markets: number;

  @ApiModelProperty()
  main_market?: string;

  @ApiModelProperty()
  secondary_market?: string;

  @ApiModelProperty()
  has_video: boolean;

  @ApiModelProperty()
  provider?: string;
}
class BetSystem {
  id: number;
  win_count: number;
  total_count: number;
}

class BetBonus {
  id: string;
  type: string;
  odds: number;
}

class BetStake {
  value: number;
  currency: string;
  subunits: number;
}

export class Competitor {
  name: string;
  logo: string;
  urn_id: string;
}

class Competitors {
  home: Competitor;
  away: Competitor;
}

class Tournament {
  id: number;
  urn_id: string;
  name: string;
  priority: number;
  sport: Sport;
  category: Category;
  slug: string;
}

class Score {
  home: number;
  away: number;
}

class PeriodScore extends Score {
  period_key: string;
  period_name: string;
  number: number;
  type: string;
}

class Statistics {
  clock?: any; // not used yet
  total_score: Score;
  period_score: PeriodScore[];
  game_score?: Score;
  max_period_number?: number;
  current_server?: any; // not used yet
}

class Match {
  id: number;
  urn_id: string;
  start_time: string;
  end_date: string;
  status: number;
  type: string;
  stage: string;
  name: string;
  competitors: Competitors;
  tournament: Tournament;
  statistics: Statistics;
  stadium: string;
  city: string;
  slug: string;
  available_markets: number;
  top_markets: number;
  main_market?: string;
  secondary_market?: string;
  has_video: boolean;
}

class Market {
  id: number;
  name: string;
  specifier?: string;
}

class Outcome {
  id: number;
  name: string;
}

export class Selection {
  id: string;
  odds: number;
  match: Match;
  market: Market;
  outcome: Outcome;
  status: OUTCOME_STATUSES_SS_ENUM;
  provider: string;
  event_type: string;
  played_outcome: Outcome;
  score_home: number;
  score_away: number;
  fee_group: string;
  risk?: number;
  pool?: number;
  profit?: number;
  oddsCalculated?: number;
  specifier?: string;

  constructor(data?) {
    assign(this, data);
  }

  get customStatus(): OUTCOME_STATUSES_ENUM | null {
    if (this.status === OUTCOME_STATUSES_SS_ENUM.NO_RESULTS) {
      return null;
    }

    if (this.status === OUTCOME_STATUSES_SS_ENUM.WIN_ENTIRE) {
      return OUTCOME_STATUSES_ENUM.WIN;
    }

    if (this.status === OUTCOME_STATUSES_SS_ENUM.LOSE_ENTIRE) {
      return OUTCOME_STATUSES_ENUM.LOSS;
    }

    if (this.status === OUTCOME_STATUSES_SS_ENUM.REFUND_ENTIRE) {
      return OUTCOME_STATUSES_ENUM.REFUND;
    }

    if (this.status === OUTCOME_STATUSES_SS_ENUM.REFUND_HALF_LOSE_OTHER) {
      return OUTCOME_STATUSES_ENUM.LOSS_REFUND;
    }

    if (this.status === OUTCOME_STATUSES_SS_ENUM.REFUND_HALF_WIN_OTHER) {
      return OUTCOME_STATUSES_ENUM.WIN_REFUND;
    }
  }
}

export class BetData {
  id: string;
  ref: string;
  type: BET_TYPES_SS_ENUM;
  stake: BetStake;
  win_amount: number;
  status: string;
  result: BET_RESULTS_SS_ENUM;
  odds: number;
  to_cashout: number;
  created_at: string;
  system: BetSystem;
  system_id?: number;
  bonus?: BetBonus;
  player_id: number;
  user_id: number;
  user_verified: boolean;
  user_ip: string;
  user_device: string;
  stake_eur: BetStake;
  win_amount_eur: number;
  potential_win_amount: number;
  potential_win_amount_eur: number;
  margin: number;
  bet_result: string;
  settled_at: string;
  is_cashed_out: boolean;
  selections: Selection[];
  combinationsCount?: number;
  totalRisk?: number;
  stake_total?: number;
  possible_win_internal_eur?: number;
  constructor(data?) {
    assign(this, data);

    this.selections = this.selections.map((selection) => new Selection(selection));
  }

  getSelectionByStatuses(statutes: OUTCOME_STATUSES_ENUM[]) {
    return filter(this.selections, (selection: Selection) => includes(statutes, selection.customStatus));
  }

  get customBetType(): BET_TYPES_ENUM {
    if (this.type === BET_TYPES_SS_ENUM.SINGLE) {
      return BET_TYPES_ENUM.SINGLE;
    }
    if (this.type === BET_TYPES_SS_ENUM.COMBO) {
      return BET_TYPES_ENUM.COMBO;
    }
    if (this.type === BET_TYPES_SS_ENUM.SYSTEM) {
      return BET_TYPES_ENUM.SYSTEM;
    }
  }
  //   get customBetType(): {

  //     if(this.type === BET_TYPES_SS_ENUM.SINGLE){
  //       return BET_TYPES_ENUM.SINGLE;
  //     }
  // // if(this.type === BET_TYPES_SS_ENUM.COMBO){
  // //   return BE;
  // // }
  // // if(this.type === BET_TYPES_SS_ENUM.SYSTEM){
  // //   return BE;
  // // }
  //   };

  get customBetResult(): BET_RESULTS_ENUM | null {
    if (this.result === BET_RESULTS_SS_ENUM.NO_RESULTS) {
      return null;
    }

    if (this.result === BET_RESULTS_SS_ENUM.REFUND) {
      if (this.win_amount < this.stake.value) {
        return BET_RESULTS_ENUM.PART_LOSS;
      }

      return BET_RESULTS_ENUM.REFUND;
    }

    if (this.result === BET_RESULTS_SS_ENUM.CANCEL) {
      return BET_RESULTS_ENUM.CANCEL;
    }

    if (this.result === BET_RESULTS_SS_ENUM.LOSE) {
      return BET_RESULTS_ENUM.LOSE;
    }

    if (this.result === BET_RESULTS_SS_ENUM.WIN) {
      if (this.win_amount === this.potential_win_amount) {
        return BET_RESULTS_ENUM.WIN;
      }

      if (this.win_amount < this.stake.value) {
        return BET_RESULTS_ENUM.PART_LOSS;
      }

      if (this.win_amount > this.stake.value) {
        return BET_RESULTS_ENUM.PART_WIN;
      }
    }
  }

  get closed(): number {
    return Number(every(this.selections, (selection) => selection.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS));
  }
}
