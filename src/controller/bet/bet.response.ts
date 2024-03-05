import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { BetOutcome } from '../../db/models';
import bigDecimal from 'js-big-decimal';

import lodash, { compact, get } from 'lodash';
import { ARRAY } from '../../../swagger/swagger-type';
import { BET_HISTORY_TABLE_COLUMNS_ENUM } from '../../helper/constants';
const { pick, assign, values, keys, omit, filter } = lodash;

const setNullishNumber = (value: string) => (value ?? undefined) && parseFloat(value);

const getResponsePropertyWrapper =
  (data: any, columns: BET_HISTORY_TABLE_COLUMNS_ENUM[]) => (column: BET_HISTORY_TABLE_COLUMNS_ENUM, path: string) =>
    columns.includes(column) ? get(data, path) : undefined;

@ApiModel({
  name: 'BetTableColumnsResponse',
})
export class BetTableColumnsResponse {
  @ApiModelProperty({
    enum: Object.values(BET_HISTORY_TABLE_COLUMNS_ENUM),
    type: ARRAY,
    example: Object.values(BET_HISTORY_TABLE_COLUMNS_ENUM),
  })
  columns: BET_HISTORY_TABLE_COLUMNS_ENUM[];
}
@ApiModel({
  name: 'BetResponse',
})
export class BetResponse {
  //#region  Properties
  @ApiModelProperty()
  id: number = undefined;

  @ApiModelProperty()
  user_id: number = undefined;

  @ApiModelProperty()
  platform_user_id: number;

  @ApiModelProperty()
  result?: string = undefined;

  @ApiModelProperty()
  system: number = undefined;

  @ApiModelProperty()
  platform_id: number = undefined;

  @ApiModelProperty()
  odds: number = undefined;

  @ApiModelProperty()
  cashout_amount: number = undefined;

  @ApiModelProperty()
  cashout_amount_default: number = undefined;

  @ApiModelProperty()
  user_ip: string;

  @ApiModelProperty()
  type: string = undefined;

  @ApiModelProperty()
  closed: number = undefined;

  @ApiModelProperty()
  stake: number = undefined;

  @ApiModelProperty()
  win: number = undefined;

  @ApiModelProperty()
  risk: number = undefined;

  @ApiModelProperty()
  op_risk: number = undefined;

  @ApiModelProperty()
  possible_win: number = undefined;

  @ApiModelProperty()
  comment: string = undefined;

  @ApiModelProperty()
  currency_code: string = undefined;

  @ApiModelProperty()
  currency_value: number = undefined;

  @ApiModelProperty()
  created_at: number;

  @ApiModelProperty()
  resulted_at: number;

  @ApiModelProperty()
  stake_op_currency: number = undefined;

  @ApiModelProperty()
  bonus_id?: string;

  @ApiModelProperty()
  bonus_type?: string;

  @ApiModelProperty({
    model: 'BetOutcomeResponse',
  })
  outcomes: BetOutcomeResponse[];
  //#endregion
  constructor(data: any, requestedColumns: BET_HISTORY_TABLE_COLUMNS_ENUM[]) {
    if (data) {
      const getProperty = getResponsePropertyWrapper(data, requestedColumns);
      assign(this, pick(data, keys(this)));

      this.created_at = data?.created_at && new Date(data.created_at).getTime();
      this.resulted_at = data?.resulted_at && new Date(data.resulted_at).getTime();

      this.currency_value = setNullishNumber(data.currency_value);
      this.stake = setNullishNumber(data.stake);
      this.win = setNullishNumber(data.win);
      this.possible_win = setNullishNumber(data.possible_win);

      this.cashout_amount = setNullishNumber(data.cashout_amount);
      this.cashout_amount_default =
        this.currency_value && this.cashout_amount ? this.cashout_amount / this.currency_value : 0;

      this.platform_user_id = data.platformUser.user_id;
      this.user_ip = data.platformUser?.data?.user_ip;
      this.platform_id = data.platformUser?.platform_id;
      this.bonus_type = getProperty(BET_HISTORY_TABLE_COLUMNS_ENUM.BONUS_TYPE, 'betAttributes.bonus_type');

      if (!this.result) {
        const risk = bigDecimal.subtract(data.current_possible_win || data.possible_win, data.stake);
        const op_risk = risk && data.currency_value ? bigDecimal.divide(risk, data.currency_value, 6) : undefined;
        this.risk = Math.max(Number(risk) || 0, 0);
        this.op_risk = Math.max(Number(op_risk) || 0, 0);
      } else {
        this.risk = 0;
        this.op_risk = 0;
      }
      if (this.stake && this.currency_value && requestedColumns.includes(BET_HISTORY_TABLE_COLUMNS_ENUM.STAKE)) {
        this.stake_op_currency = this.stake / this.currency_value;
      }

      if (data?.betOutcomes?.length) {
        const mappedOutcomes = data?.betOutcomes.map(
          (outcome: BetOutcome) =>
            new BetOutcomeResponse(
              {
                ...outcome.betOutcomeAttributes,
                ...outcome,
                ...pick(this, 'currency_code', 'currency_value'),
              },
              requestedColumns,
            ),
        );

        const nonEmptyOutcomes = filter(mappedOutcomes, (outcome) => !outcome.isEmpty);

        if (nonEmptyOutcomes.length) {
          this.outcomes = nonEmptyOutcomes;
        }
      }
    }
  }
}

@ApiModel({ name: 'BetOutcomeResponse' })
export class BetOutcomeResponse {
  // #region Properties (10)
  // @ApiModelProperty()
  // id: number = undefined;

  @ApiModelProperty()
  prematch: number = undefined;

  @ApiModelProperty()
  game_id: number = undefined;

  @ApiModelProperty()
  teams: string[];

  @ApiModelProperty()
  outcome_id: number = undefined;

  @ApiModelProperty()
  outcome_name?: string = undefined;

  @ApiModelProperty()
  game_outcome_value?: string = undefined;

  @ApiModelProperty()
  game_market_id: number;

  @ApiModelProperty()
  odds: number;

  @ApiModelProperty()
  risk: number;

  @ApiModelProperty()
  pool: number;

  @ApiModelProperty()
  profit: number;

  @ApiModelProperty()
  op_risk: number = 0;

  @ApiModelProperty()
  result: string = undefined;

  @ApiModelProperty()
  event_start: number = undefined;

  @ApiModelProperty()
  event_finish;

  @ApiModelProperty()
  section: string = undefined;

  @ApiModelProperty()
  sport_name: string = undefined;

  @ApiModelProperty()
  category_name: string = undefined;

  @ApiModelProperty()
  competition_name: string = undefined;

  @ApiModelProperty()
  game_status: string = undefined;

  @ApiModelProperty()
  game_name: string = undefined;

  @ApiModelProperty()
  market_name: string = undefined;

  @ApiModelProperty()
  market_id: number = undefined;

  // #endregion
  constructor(data: any, requestedColumns: BET_HISTORY_TABLE_COLUMNS_ENUM[]) {
    if (data) {
      assign(this, pick(data, keys(this)));

      this.teams = compact([data.home_team_name, data.away_team_name]);

      this.prematch = data.section && Number(data.section === 'prematch');
      this.odds = setNullishNumber(data.odds);
      this.op_risk = setNullishNumber(data.risk);
      this.pool = setNullishNumber(data.pool) || null;
      this.profit = setNullishNumber(data.profit);

      if (
        (this.op_risk !== null || this.op_risk !== undefined) &&
        data.currency_value &&
        requestedColumns.includes(BET_HISTORY_TABLE_COLUMNS_ENUM.RISK_CUSTOM)
      ) {
        this.risk = Number(bigDecimal.round(bigDecimal.multiply(this.op_risk, data.currency_value), 6));
      }
    }
  }

  get isEmpty() {
    return values(this).every((value) => value === undefined || value === null);
  }
}
