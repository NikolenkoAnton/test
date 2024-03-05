import { format, formatISO } from 'date-fns';
import { Combination } from 'js-combinatorics';
import { clone, map, min, pick, sum } from 'lodash';
import ms from 'ms';
import { Op, Transaction } from 'sequelize';
import sequelize from '../db';
import {
  Bet,
  BetAttributes,
  BetOutcome,
  BetOutcomeAttributes,
  Category,
  Competition,
  Currency,
  Game,
  GameTeam,
  MarketGroup,
  MarketGroupSs,
  Outcome,
  OutcomeSs,
  PlatformUser,
  Sport,
  Team,
} from '../db/models';
import '../db/streaming';
import { getStreamingUserById } from '../db/streaming';
import { BET_TYPES_ENUM, OUTCOME_STATUSES_ENUM, OUTCOME_STATUSES_SS_ENUM } from '../helper/bet_constants';
import { log } from '../helper/sentry';
import { getBetData } from '../lib/softswiss';
import * as SS_CONSTANTS from '../lib/softswiss/constants';
import { BET_RESULTS_ENUM, BET_RESULTS_SS_ENUM } from './../helper/bet_constants';
import { BetData, Competitor, Selection } from './../lib/softswiss/dto';
import bigDecimal from 'js-big-decimal';

const PLATFORM_ID = 1;
export const ATTEMPTS_DELAYS = {
  0: ms('10m'),
  1: ms('10m'),
  2: ms('10m'),
  3: ms('30m'),
  4: ms('1h'),
  5: ms('3h'),
  6: ms('12h'),
  7: ms('24h'),
  8: ms('24h'),
  9: ms('7d'),
};

export class BetBuilder {
  private bet: Bet;

  private proceed_attempts: number;

  private betData: BetData;

  private transaction: Transaction;

  constructor(bet: Bet) {
    this.bet = bet;
    this.proceed_attempts = bet.proceed_attempts;
  }

  getPlatformUser = async () => {
    let platformUser = await PlatformUser.findOne({
      where: {
        platform_id: PLATFORM_ID,
        user_id: this.betData.player_id,
      },
    });

    const streamingUser = await getStreamingUserById(this.betData.player_id);

    const streamingUserKeys = [
      'first_name',
      'last_name',
      'email',
      'postal_code',
      'address',
      'address_2',
      'country',
      'city',
      'date_of_birth',
      'gender',
      'language',
      'personal_id_number',
      'stag_affiliate',
      'receive_promos',
      'receive_sms_promos',
      'duplicate',
    ];

    const streamingUserAttributes = pick(streamingUser || {}, streamingUserKeys);

    if (!platformUser) {
      platformUser = await PlatformUser.create(
        {
          platform_id: PLATFORM_ID,
          user_id: this.betData.player_id,
          data: {
            user_id: this.betData.user_id,
            user_ip: this.betData.user_ip,
            user_device: this.betData.user_device,
            user_verified: this.betData.user_verified,
            user_country: streamingUser?.country,
            ...streamingUserAttributes,
          },
        },
        { transaction: this.transaction },
      );
    }

    return platformUser;
  };

  getBetAttributes = async () => {
    let betAttributes = await BetAttributes.findOne({
      where: { bet_id: this.bet.id },
      transaction: this.transaction,
    });

    if (!betAttributes) {
      betAttributes = await BetAttributes.create(
        {
          bet_id: this.bet.id,
          bonus_id: this.betData.bonus?.id,
          bonus_type: this.betData.bonus?.type,
        },
        { transaction: this.transaction },
      );
    }

    if (this.betData.bonus) {
      await betAttributes.update(
        { bonus_id: this.betData.bonus.id, bonus_type: this.betData.bonus.type },
        { transaction: this.transaction },
      );
    }

    if (this.betData.selections.length) {
      await betAttributes.update(
        {
          outcome_counts: `${this.betData.system?.win_count || this.betData.selections.length}/${
            this.betData.selections.length
          }`,
        },
        { transaction: this.transaction },
      );
    }
    return betAttributes;
  };

  calculateSystemRisks = async () => {
    const combinations = new Combination(
      map(this.betData.selections, 'oddsCalculated'),
      this.betData.system.win_count,
    ).toArray();

    // this.betData.stake_total =
    //   ((this.betData.stake.value / this.betData.stake.subunits) * combinations.length) / this.bet.currency_value;

    // await this.bet.update({ stake: this.betData.stake_total }, { transaction: this.transaction });
    this.betData.combinationsCount = combinations.length;

    const totalRisk = combinations.reduce((acc, risks) => {
      const sum = risks.reduce((acc1, risksOne) => acc1 * risksOne);

      return acc + sum;
    }, 0);

    const possible_win_internal =
      (totalRisk - combinations.length) * (this.betData.stake.value / this.betData.stake.subunits);

    const possible_win_internal_eur = possible_win_internal / this.bet.currency_value;

    this.betData.possible_win_internal_eur = Number(possible_win_internal_eur.toFixed(3));

    const diff = (this.bet.stake - this.bet.win) / this.bet.currency_value;

    this.betData.selections = this.betData.selections.map((sel: Selection) => {
      const top = sel.oddsCalculated - 1;

      const oddsArr = this.betData.selections.filter((s: Selection) => s.oddsCalculated > 0);

      const bot = sum(map(oddsArr, 'oddsCalculated')) - oddsArr.length;

      sel.risk = (top / bot) * this.betData.possible_win_internal_eur;

      if (sel.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS) {
        sel.risk = 0;
      }

      const allSelectionsWithResults = this.betData.selections.filter(
        (selection: Selection) => selection.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS,
      );

      if (this.betData.result === BET_RESULTS_SS_ENUM.NO_RESULTS) {
        sel.profit = null;

        if (sel.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS || allSelectionsWithResults.length === 0) {
          sel.pool =
            sel.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS
              ? this.bet.stake / this.bet.currency_value / allSelectionsWithResults.length
              : this.bet.stake / this.bet.currency_value / this.betData.selections.length;
        } else {
          sel.pool = null;
        }
      }
      if (
        [BET_RESULTS_ENUM.WIN, BET_RESULTS_ENUM.PART_WIN, BET_RESULTS_ENUM.LOSE, BET_RESULTS_ENUM.PART_LOSS].includes(
          this.bet.result,
        )
      ) {
        if (sel.status === OUTCOME_STATUSES_SS_ENUM.NO_RESULTS) {
          sel.profit = null;
        } else {
          sel.pool = this.bet.stake / this.bet.currency_value / allSelectionsWithResults.length;
        }

        const filteredSelection =
          diff > 0
            ? this.betData.getSelectionByStatuses([OUTCOME_STATUSES_ENUM.LOSS, OUTCOME_STATUSES_ENUM.LOSS_REFUND])
            : this.betData.getSelectionByStatuses([OUTCOME_STATUSES_ENUM.WIN, OUTCOME_STATUSES_ENUM.WIN_REFUND]);
        sel.profit =
          (diff > 0 && [OUTCOME_STATUSES_ENUM.LOSS, OUTCOME_STATUSES_ENUM.LOSS_REFUND].includes(sel.customStatus)) ||
          (diff < 0 && [OUTCOME_STATUSES_ENUM.WIN, OUTCOME_STATUSES_ENUM.WIN_REFUND].includes(sel.customStatus))
            ? diff / filteredSelection.length
            : 0;
      }

      return sel;
    });
  };

  calculateComboRisks = () => {
    const diff = (this.bet.stake - this.bet.win) / this.bet.currency_value;

    this.betData.selections = this.betData.selections.map((selection: Selection) => {
      const allSelectionsWithResults = this.betData.selections.filter(
        (s: Selection) => s.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS,
      );

      if (selection.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS || allSelectionsWithResults.length === 0) {
        selection.pool =
          selection.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS
            ? this.bet.stake / this.bet.currency_value / allSelectionsWithResults.length
            : this.bet.stake / this.bet.currency_value / this.betData.selections.length;
      } else {
        selection.pool = null;
      }

      if (this.betData.result === BET_RESULTS_SS_ENUM.NO_RESULTS) {
        const oddsArr = this.betData.selections.filter((s: Selection) => s.oddsCalculated > 1);
        const bot = sum(map(oddsArr, 'oddsCalculated')) - oddsArr.length;

        selection.risk =
          selection.status === OUTCOME_STATUSES_SS_ENUM.NO_RESULTS
            ? ((selection.oddsCalculated - 1) / bot) * this.bet.risk_op
            : 0;

        selection.profit = null;
      }

      if (this.bet.result === BET_RESULTS_ENUM.LOSE) {
        const oddsArr = this.betData.getSelectionByStatuses([
          OUTCOME_STATUSES_ENUM.LOSS,
          OUTCOME_STATUSES_ENUM.LOSS_REFUND,
        ]);

        selection.risk = 0;

        selection.profit = null;

        if (selection.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS) {
          selection.profit = [OUTCOME_STATUSES_ENUM.LOSS, OUTCOME_STATUSES_ENUM.LOSS_REFUND].includes(
            selection.customStatus,
          )
            ? diff / oddsArr.length
            : 0;
        }
      }

      if (this.bet.result === BET_RESULTS_ENUM.WIN) {
        const oddsArr = this.betData.getSelectionByStatuses([
          OUTCOME_STATUSES_ENUM.WIN,
          OUTCOME_STATUSES_ENUM.WIN_REFUND,
        ]);

        selection.risk = 0;

        selection.profit = diff / oddsArr.length;
      }
      return selection;
    });
  };

  calculateOrdinarRisk = () => {
    if (this.betData.result === BET_RESULTS_SS_ENUM.NO_RESULTS) {
      this.betData.selections.forEach((selection) => {
        selection.risk = this.bet.risk_op;
        selection.profit = null;
        selection.pool = this.bet.stake / this.bet.currency_value;
      });
    } else {
      this.betData.selections.forEach((item) => {
        item.risk = 0;
        item.pool = this.bet.stake / this.bet.currency_value;
        item.profit = (this.bet.stake - this.bet.win) / this.bet.currency_value;
      });
    }
  };

  handle = async () => {
    this.transaction = await sequelize.transaction();
    try {
      this.betData = await getBetData(this.bet.uuid);

      const platformUser = await this.getPlatformUser();

      const betAttributes = await this.getBetAttributes();

      const currency = await Currency.findOne({
        where: {
          code: this.betData.stake.currency,
        },
      });

      const totalCoef = this.betData.odds / 1000;
      let stake = this.betData.stake.value / this.betData.stake.subunits;

      if (this.betData.customBetType === BET_TYPES_ENUM.SYSTEM) {
        stake *= Number(new Combination(this.betData.selections, this.betData.system.win_count).length);
      }

      const possible_win = bigDecimal.divide(this.betData.potential_win_amount, this.betData.stake.subunits, 6);

      await this.bet.update(
        {
          user_id: platformUser.id,
          closed: this.betData.closed,
          stake: stake,
          stake_real: null,
          odds: totalCoef,
          cashout_amount: this.betData.to_cashout / this.betData.stake.subunits,
          win: this.betData.win_amount / this.betData.stake.subunits,
          possible_win,
          system: this.betData.customBetType === BET_TYPES_ENUM.SYSTEM ? this.betData.system.win_count : 0,
          type: this.betData.customBetType,
          currency_code: this.betData.stake.currency,
          currency_value: currency && currency.value,
          placed_at: this.betData.created_at,
          result: this.betData.customBetResult,
          resulted_at: this.betData.settled_at,
          proceed_attempts: this.bet.proceed_attempts ? this.bet.proceed_attempts : 0,
          updated_at: new Date(),
        },
        { transaction: this.transaction },
      );

      let nearestEventTimestamp = new Date(this.betData.selections[0].match.start_time).getTime();

      this.betData.selections = this.betData.selections.map((selection: Selection) => {
        selection.oddsCalculated = selection.odds / 1000;

        if (selection.status !== OUTCOME_STATUSES_SS_ENUM.NO_RESULTS) {
          selection.oddsCalculated = 0;
        }

        if (selection.customStatus === OUTCOME_STATUSES_ENUM.REFUND) {
          selection.oddsCalculated = 1;
        }

        return selection;
      });
      if (this.betData.customBetType === BET_TYPES_ENUM.SYSTEM) {
        await this.calculateSystemRisks();
      }
      if (this.betData.customBetType === BET_TYPES_ENUM.COMBO) {
        this.calculateComboRisks();
      }
      if (this.betData.customBetType === BET_TYPES_ENUM.SINGLE) {
        this.calculateOrdinarRisk();
      }

      await BetOutcome.destroy({ where: { bet_id: this.bet.id }, transaction: this.transaction });

      // let createOrUpdateStatus = false;

      const queueHandler = async (selections: Selection[]) => {
        if (!selections.length) return;

        const selection = selections.shift();

        const isUpdate = await new SelectionBuilder(selection, this.bet, this.transaction).handle();
        // createOrUpdateStatus ||= isUpdate;

        return queueHandler(selections);
      };

      await queueHandler(clone(this.betData.selections));
      // for (const selection of this.betData.selections) {
      //   const isUpdate = await new SelectionBuilder(selection, this.bet, this.transaction).handle();

      //   createOrUpdateStatus ||= isUpdate;
      // }
      const attempt = min([this.bet.proceed_attempts, 8]);

      const in2HoursAfterNearestEvent = nearestEventTimestamp + ms('2h');
      const delayedAttempt = Date.now() + ATTEMPTS_DELAYS[attempt];

      if (!this.betData.closed) {
        await this.bet.update(
          {
            updated_at: new Date(),
            proceed_attempts: attempt + 1,
            proceed_after: formatISO(new Date(Math.max(in2HoursAfterNearestEvent, delayedAttempt))),
          },
          { transaction: this.transaction },
        );
      }
      await this.transaction.commit();
    } catch (err) {
      await this.transaction.rollback();
      const attempt = min([this.bet.proceed_attempts, 8]);
      const delayedAttempt = Date.now() + ATTEMPTS_DELAYS[attempt];
      await Bet.update(
        {
          updated_at: new Date(),
          proceed_attempts: attempt + 1,
          proceed_after: formatISO(new Date(delayedAttempt)),
        },
        { where: { id: this.bet.id } },
      );

      log(err, { extra: { bet_id: this.bet.id } });
    }
  };
}

export class SelectionBuilder {
  private readonly gameExternalId: string;
  private readonly sportExternalId: string;
  private readonly categoryExternalId: string;
  private readonly competitionExternalId: string;

  private sport: Sport;

  private category: Category;

  private competition: Competition;

  private game: Game;

  private transaction: Transaction;

  private market: MarketGroup;

  private outcome: Outcome;

  private betOutcome: BetOutcome;

  private createOrUpdate = false;

  private bet: Bet;

  constructor(private readonly data: Selection, bet: Bet, transaction: Transaction) {
    this.bet = bet;
    this.transaction = transaction;

    const {
      match: {
        urn_id: gameUrnId,
        tournament: {
          sport: { urn_id: sportUrnId },
          category: { urn_id: categoryUrnId },
          urn_id: competitionUrnId,
        },
      },
    } = data;

    this.gameExternalId = gameUrnId;
    this.sportExternalId = sportUrnId;
    this.categoryExternalId = categoryUrnId;
    this.competitionExternalId = competitionUrnId;
  }

  handle = async () => {
    await this.getSport();
    await this.getCategory();
    await this.getCompetition();
    await this.getGame();
    await this.getMarketGroup();
    await this.getOutcome();
    await this.getBetOutcome();

    const teams: Team[] = [];

    const teamsQueryHandler = async (competitors: Competitor[]) => {
      if (!competitors.length) return;

      const competitor = competitors.shift();
      const team = await this.findTeam({ ...competitor, sportId: this.sport.id });
      teams.push(team);

      return teamsQueryHandler(competitors);
    };

    const mappedCompetitors: Competitor[] = map(this.data.match?.competitors || {}, (competitor) => competitor);

    await teamsQueryHandler(mappedCompetitors);

    // for (const competitor of values(this.data.match?.competitors || {})) {
    //   const team = await this.findTeam({ ...(competitor as any), sportId: this.sport.id });
    //   teams.push(team);
    // }
    // const teams = await Promise.all(
    //   values(this.data.match?.competitors || {}).map(
    //     async (competitor: Competitor) =>
    //   ),
    // );

    const teamAttributes = { home_team_id: null, away_team_id: null, home_team_name: null, away_team_name: null };

    const gameTeams = await Promise.all(
      teams.map((team) => {
        const homeCompetitor = this.data.match?.competitors?.home?.name;
        const type = !homeCompetitor ? null : homeCompetitor === team.en ? 'home' : 'away';

        if (['home', 'away'].includes(type)) {
          teamAttributes[`${type}_team_id`] = team.id;
          teamAttributes[`${type}_team_name`] = team.en;
        }

        return this.getOrCreateGameTeam(team, this.game, type, this.transaction);
      }),
    );

    const betOutcomeAttributes =
      (await this.betOutcome.$get('betOutcomeAttributes', { transaction: this.transaction })) ||
      (await BetOutcomeAttributes.create(
        {
          bet_outcome_id: this.betOutcome.id,

          sport_external_id: this.sportExternalId,
          category_external_id: this.categoryExternalId,
          competition_external_id: this.competitionExternalId,
          game_external_id: this.gameExternalId,
          ...teamAttributes,

          event_start: this.game.start,

          // game_market_id: ssOutcome.ss_market_id,
          game_status: SS_CONSTANTS.GAME_STATUSES[this.game.status_custom || this.game.status],

          //? new column
          outcome_name: this.outcome?.type || this.data.outcome?.name,
          market_name: this.market?.type || this.data.market?.name,
          market_id: this.market?.id,

          sport_id: this.sport.id,
          category_id: this.category.id,
          competition_id: this.competition.id,

          sport_name: this.sport.en,
          category_name: this.category.en,
          competition_name: this.competition.en,

          game_name: this.game.name,
        },
        { transaction: this.transaction, returning: true, ignoreDuplicates: true },
      ));

    return this.createOrUpdate;
  };

  getSport = async (): Promise<Sport> => {
    let sport = await Sport.findOne({
      where: {
        external_id: this.sportExternalId,
      },
      transaction: this.transaction,
    });

    if (!sport) {
      sport = await Sport.create(
        {
          enabled: 1,
          en: this.data.match.tournament.sport.name,
          esport: this.data.match.tournament.sport.type === 'cyber' ? 1 : 0,
          external_id: this.sportExternalId,
        },
        { transaction: this.transaction },
      );
    }

    this.sport = sport;
    return sport;
  };

  getCategory = async (): Promise<Category> => {
    let category = await Category.findOne({
      where: {
        external_id: this.categoryExternalId,
        sport_id: this.sport.id,
      },
      transaction: this.transaction,
    });

    if (!category) {
      category = await Category.create(
        {
          sport_id: this.sport.id,
          en: this.data.match.tournament.category.name,
          external_id: this.categoryExternalId,
        },
        { transaction: this.transaction },
      );
    }
    this.category = category;
    return category;
  };

  getCompetition = async (): Promise<Competition> => {
    let competition = await Competition.findOne({
      where: {
        external_id: this.competitionExternalId,
      },
      transaction: this.transaction,
    });

    if (!competition) {
      competition = await Competition.create(
        {
          sport_id: this.sport.id,
          category_id: this.category.id,
          en: this.data.match.tournament.name,
          external_id: this.competitionExternalId,
        },
        { transaction: this.transaction },
      );
    }
    this.competition = competition;
    return competition;
  };

  getGame = async (): Promise<Game> => {
    let game = await Game.findOne({
      where: {
        external_id: this.gameExternalId,
      },
      transaction: this.transaction,
    });

    if (!game) {
      const name =
        this.data.match.name ||
        `${this.data.match.competitors?.home?.name || ''} - ${this.data.match.competitors?.away?.name || ''}`;
      const date = new Date(this.data.match.start_time);
      game = await Game.create(
        {
          competition_id: this.competition.id,
          start_date: format(date, 'yyyy-MM-dd'),
          start_time: format(date, 'HH:mm:ss'),
          start: this.data.match.start_time,
          status: this.data.match.status,
          name, // make bet for racing
          external_id: this.gameExternalId,
        },
        { transaction: this.transaction },
      );
    }

    this.game = game;
    return game;
  };

  getMarketGroup = async (): Promise<MarketGroup> => {
    let marketGroupSs = await MarketGroupSs.findOne({
      attributes: ['br_id'],
      where: {
        ss_id: this.data.market.id,
      },
      transaction: this.transaction,
    });

    const br_id = marketGroupSs?.br_id || 535;

    const marketGroup = await MarketGroup.findOne({
      where: { provider_market_group_id: br_id, sport_id: this.sport.id },
      transaction: this.transaction,
    });

    this.market = marketGroup;
    return marketGroup;
  };

  getOutcome = async (): Promise<Outcome> => {
    const outcomeSs =
      this.market?.provider_market_group_id === 535
        ? null
        : await OutcomeSs.findOne({ where: { ss_id: this.data.outcome.id } });

    const provider_outcome_id =
      !this.market?.provider_market_group_id || this.market?.provider_market_group_id === 535 ? '0' : outcomeSs?.br_id;

    const outcome = await Outcome.findOne({
      where: { market_group_id: this.market?.id, provider_outcome_id: provider_outcome_id || '0' },
    });

    this.outcome = outcome;
    return outcome;
  };

  getBetOutcome = async (): Promise<BetOutcome> => {
    const prematch = this.data.event_type === 'prematch';

    let betOutcome = await BetOutcome.findOne({
      where: {
        bet_id: this.bet.id,
        game_id: this.game.id,
        game_outcome_value: this.data.outcome.name,
      },
      transaction: this.transaction,
    });

    if (!betOutcome) {
      betOutcome = await BetOutcome.create(
        {
          bet_id: this.bet.id,
          game_outcome_id: null,
          game_id: this.game.id,
          outcome_id: this.outcome?.id,
          //game_outcome_value: bb_game_outcome.value
          // this.data.specifier
          game_outcome_value: this.data.specifier,
          //game_market_value: bb_game_market.value

          // this.data.market.specifier
          game_market_value: this.data.market?.specifier,
          game_market_period: 'FT',
          section: prematch ? 'prematch' : 'live',
          odds: this.data.odds / 1000,
          risk: this.data.risk,
          pool: this.data.pool,
          profit: this.data.profit,
          result: this.data.customStatus,
        },
        { transaction: this.transaction },
      );
      this.createOrUpdate = true;
    } else if (
      betOutcome.result !== this.data.customStatus ||
      betOutcome.risk !== this.data.risk ||
      betOutcome.pool !== this.data.pool ||
      betOutcome.profit !== this.data.profit
    ) {
      await betOutcome.update(
        {
          result: this.data.customStatus,
          risk: this.data.risk,
          pool: this.data.pool,
          profit: this.data.profit,
          updated_at: new Date(),
        },
        { transaction: this.transaction },
      );

      this.createOrUpdate = true;
    }
    this.betOutcome = betOutcome;
    return betOutcome;
  };

  findTeam = async (data: Competitor & { sportId: number }) => {
    if (!data.name) {
      return;
    }

    let team = await Team.findOne({
      where: {
        external_id: data.urn_id,
      },
      transaction: this.transaction,
    });

    if (!team) {
      team = await Team.create(
        {
          en: data.name,
          icon: data.logo,
          sport_id: data.sportId,
          external_id: data.urn_id,
        },
        { transaction: this.transaction },
      );
    }

    return team;
  };

  getOrCreateGameTeam = async (team: Team, game: Game, type: string, transaction?: Transaction): Promise<GameTeam> => {
    let gameTeam = await GameTeam.findOne({
      where: {
        team_id: team.id,
        game_id: game.id,
      },
      include: [{ model: Team }],
      transaction,
    });
    if (!gameTeam) {
      gameTeam = await GameTeam.create(
        {
          team_id: team.id,
          game_id: game.id,
          type,
          start_date: game.start_date,
        },
        { returning: true, transaction },
      );
    }
    return gameTeam;
  };
}

let executing = false;

export default async function () {
  if (executing) {
    return;
  }

  try {
    executing = true;

    const betsToProceed = await Bet.findAll({
      where: {
        [Op.or]: [
          {
            closed: 0,
            proceed_attempts: {
              [Op.lt]: parseInt(Object.keys(ATTEMPTS_DELAYS)[Object.keys(ATTEMPTS_DELAYS).length - 1]) + 1,
            },
            uuid: {
              [Op.not]: null,
            },
            proceed_after: {
              [Op.lte]: new Date(),
            },
          },
          // {
          //   stake_real: {
          //     [Op.is]: null,
          //   },
          // },
        ],
      },
      order: [['id', 'DESC']],
    });

    const queueHandler = async (bets: Bet[]) => {
      if (!bets.length) return;

      const bet = bets.shift();

      await new BetBuilder(bet).handle();

      return queueHandler(bets);
    };

    await queueHandler(betsToProceed);

    // for await (const bet of betsToProceed) {
    //   await new BetBuilder(bet).handle();
    // }
  } catch (err) {
    log(err);
  } finally {
    executing = false;
  }
}
