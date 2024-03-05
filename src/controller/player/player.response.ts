import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { assign, pick, keys } from 'lodash';
import { BET_RESULTS_ENUM } from '../../helper/bet_constants';
@ApiModel()
export class PlayerResponse {
  @ApiModelProperty()
  current_sign_in_ip?: string = undefined;

  @ApiModelProperty()
  first_name?: string = undefined;

  @ApiModelProperty()
  last_name?: string = undefined;

  @ApiModelProperty()
  email?: string = undefined;

  @ApiModelProperty()
  postal_code?: string = undefined;

  @ApiModelProperty()
  address?: string = undefined;

  @ApiModelProperty()
  address_2?: string = undefined;

  @ApiModelProperty()
  country?: string = undefined;

  @ApiModelProperty()
  city?: string = undefined;

  @ApiModelProperty()
  date_of_birth?: string = undefined;

  @ApiModelProperty()
  gender?: string = undefined;

  @ApiModelProperty()
  language?: string = undefined;

  @ApiModelProperty()
  personal_id_number?: string = undefined;

  @ApiModelProperty()
  stag_affiliate?: string = undefined;

  @ApiModelProperty()
  receive_promos?: boolean = undefined;

  @ApiModelProperty()
  receive_sms_promos?: boolean = undefined;

  @ApiModelProperty()
  duplicate?: boolean = undefined;

  @ApiModelProperty()
  user_id?: number = undefined;

  @ApiModelProperty()
  profit?: number = undefined;

  @ApiModelProperty()
  bet_sum?: number = undefined;

  @ApiModelProperty()
  bet_counts?: number = undefined;

  @ApiModelProperty()
  rtp?: number = undefined;

  constructor(data: any) {
    if (data) {
      assign(this, pick(data, keys(this)));
    }
  }
}

@ApiModel({ name: 'PlayerStatSportsResponse' })
export class PlayerStatSportsResponse {
  @ApiModelProperty()
  sport_name: string = undefined;

  @ApiModelProperty()
  sport_id: number = undefined;

  @ApiModelProperty()
  bet_counts?: number = undefined;

  @ApiModelProperty()
  profit?: number = undefined;

  @ApiModelProperty()
  bet_sum?: number = undefined;

  @ApiModelProperty()
  rtp?: number = undefined;

  @ApiModelProperty()
  category_name: string = undefined;

  @ApiModelProperty()
  category_id: number = undefined;

  @ApiModelProperty()
  competition_name: string = undefined;

  @ApiModelProperty()
  competition_id: number = undefined;

  constructor(data: any) {
    if (data) {
      assign(this, pick(data, keys(this)));
    }
  }
}

@ApiModel()
export class PlayerStatResponse {
  @ApiModelProperty()
  bet_counts?: number;

  @ApiModelProperty()
  profit?: number;

  @ApiModelProperty()
  bet_sum?: number;

  @ApiModelProperty()
  rtp?: number;
  constructor(data: any) {
    this.bet_counts = data.bet_counts;
    this.profit = data.profit;
    this.bet_sum = data.bet_sum;
    this.rtp = data.rtp;
  }
}

@ApiModel()
export class PlayerAnalyticResponse {
  @ApiModelProperty()
  user_id?: number;

  @ApiModelProperty()
  platform_user_id?: number;

  @ApiModelProperty()
  bet_counts?: number;

  @ApiModelProperty()
  profit?: number;

  @ApiModelProperty()
  bet_sum?: number;

  @ApiModelProperty()
  rtp?: number;
  constructor(data: any) {
    assign(this, data);
  }
}

@ApiModel()
export class PlayerGraphResponse {
  @ApiModelProperty()
  x: number;
  @ApiModelProperty()
  y: number;
  @ApiModelProperty()
  stake: number;
  @ApiModelProperty()
  odds: number;
  @ApiModelProperty()
  betCounts: number;
}

@ApiModel()
export class PlayerStatResultsResponse {
  @ApiModelProperty()
  public result: BET_RESULTS_ENUM;

  @ApiModelProperty()
  bet_counts?: number;

  @ApiModelProperty()
  profit?: number;

  @ApiModelProperty()
  bet_sum?: number;

  @ApiModelProperty()
  rtp?: number;

  constructor(data: any) {
    this.result = data.result;
    this.bet_counts = data.bet_counts;
    this.profit = data.profit;
    this.bet_sum = data.bet_sum;
    this.rtp = data.rtp;
  }
}

@ApiModel()
export class PlayerStatTimeResponse extends PlayerStatResponse {
  date: Date;

  constructor(data: any) {
    super(data);
    this.date = data.date;
  }
}

@ApiModel()
export class PlayerStatTypesResponse extends PlayerStatResponse {
  @ApiModelProperty()
  type: string;

  @ApiModelProperty()
  outcome_counts: string;

  constructor(data: any) {
    super(data);
    this.type = data.type;
    this.outcome_counts = data.outcome_counts;
  }
}
