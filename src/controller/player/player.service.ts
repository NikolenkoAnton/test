import { format } from 'date-fns';
import { find, map, mapValues, orderBy, template, templateSettings, values } from 'lodash';
import { BadRequestError } from 'routing-controllers';
import { cast, col, fn, literal, Op, QueryTypes, where } from 'sequelize';
import { Literal } from 'sequelize/types/utils';
import { Service } from 'typedi';
import util from 'util';
import sequelize from '../../db';
import { Bet, BetAttributes, BetOutcome, BetOutcomeAttributes, PlatformUser } from '../../db/models';
import { BET_RESULTS_ENUM } from '../../helper/bet_constants';
import { ClusteringOutput, clusterize } from '../../helper/clusterize';
import { buildWhereOrCondition } from '../../helper/where-interval.util';
import { BetHistoryTypesPayload } from '../../interface/bet.payload';
import { PLAYER_VIEW_MAIN_TABS, PLAYER_TIME_CHUNK_INTERVAL } from './constant';
import { GetPlayerAnalyticQuery, GetPlayerGraphQuery, GetPlayerStatQuery } from './player.request';
import { PlayerAnalyticResponse, PlayerResponse } from './player.response';
templateSettings.interpolate = /{{([\s\S]+?)}}/g;

@Service()
export class PlayerService {
  private personalColumnsObjet = {
    [PLAYER_VIEW_MAIN_TABS.BET_COUNTS]: literal('COUNT(DISTINCT "Bet"."id")'),
    [PLAYER_VIEW_MAIN_TABS.BET_SUM]: literal('SUM(pool)'),
    [PLAYER_VIEW_MAIN_TABS.PROFIT]: literal('ROUND(SUM(profit),2)'),
    [PLAYER_VIEW_MAIN_TABS.RTP]: literal('(GREATEST(SUM(pool-profit),0)/SUM(pool))'),
  };

  private getColumn(column: PLAYER_VIEW_MAIN_TABS) {
    return [this.personalColumnsObjet[column], column] as [Literal, string];
  }

  async getAnalyticsPlayers(data: GetPlayerAnalyticQuery) {
    const profitSubQuery = literal(`COALESCE(ROUND(SUM((stake - win)/currency_value), 2), 0)`);
    const rtpSubQuery = literal(
      `COALESCE(ROUND((SUM(win/currency_value) / NULLIF(SUM(stake/currency_value), 0)), 4), 0)`,
    );

    const betCountSubQuery = literal(
      '(SELECT COALESCE(COUNT(*),0) FROM bb_bet bb_c WHERE bb_c.user_id = "PlatformUser"."id")',
    );

    const betSumSubQuery = literal(
      '(SELECT COALESCE(SUM(bb_c.stake/currency_value),0) FROM bb_bet bb_c WHERE bb_c.user_id = "PlatformUser"."id")',
    );

    const whereOption = {
      [Op.and]: [],
    };

    const havingOption = {
      [Op.and]: [],
    };

    if (data.min_bet_count) {
      havingOption[Op.and].push(where(betCountSubQuery, '>=', data.min_bet_count));
    }

    if (data.max_bet_count) {
      havingOption[Op.and].push(where(betCountSubQuery, '<=', data.max_bet_count));
    }

    if (data.min_profit) {
      havingOption[Op.and].push(where(profitSubQuery, '>=', data.min_profit));
    }

    if (data.max_profit) {
      havingOption[Op.and].push(where(profitSubQuery, '<=', data.max_profit));
    }

    if (data.min_rtp) {
      havingOption[Op.and].push(where(rtpSubQuery, '>=', data.min_rtp));
    }

    if (data.max_rtp) {
      havingOption[Op.and].push(where(rtpSubQuery, '<=', data.max_rtp));
    }

    if (data.min_bet_sum) {
      havingOption[Op.and].push(where(betSumSubQuery, '>=', data.min_bet_sum));
    }

    if (data.max_bet_sum) {
      havingOption[Op.and].push(where(betSumSubQuery, '<=', data.max_bet_sum));
    }

    if (data.player_id) {
      whereOption[Op.and].push(
        where(cast(col('"PlatformUser"."id"'), 'text'), 'LIKE', literal(`'${String(data.player_id)}%'`)),
      );
    }
    if (data.platform_user_id) {
      whereOption[Op.and].push(
        where(cast(col('"PlatformUser"."user_id"'), 'text'), 'LIKE', literal(`'${String(data.platform_user_id)}%'`)),
      );
    }

    const offset = (data.page - 1) * data.per_page;

    const orderOption = [];

    if (data.order_by) {
      orderOption.push([literal(data.order_by), data.order_direction]);
    }

    const analytics = await PlatformUser.findAndCountAll({
      subQuery: false,
      attributes: [
        [col('"PlatformUser"."user_id"'), 'platform_user_id'],
        [col('"PlatformUser"."id"'), 'user_id'],
        [fn('COALESCE', fn('ROUND', fn('SUM', literal('stake/currency_value - win/currency_value')), 2), 0), 'profit'],
        [
          fn(
            'COALESCE',
            fn('ROUND', literal(`(SUM(win/currency_value) / NULLIF(SUM(stake/currency_value), 0))`), 4),
            0,
          ),
          'rtp',
        ],
        [betSumSubQuery, 'bet_sum'],
        [betCountSubQuery, 'bet_counts'],
      ],
      include: [
        {
          model: Bet.scope('withEur'),
          subQuery: false,
          where: {
            closed: 1,
          },
          as: 'bets', // Make sure 'as' matches the alias used in associations
          attributes: [], // No extra attributes from the joined table
          required: false, // INNER JOIN
        },
      ],

      limit: data.per_page,
      offset: offset,

      having: havingOption,
      where: whereOption,
      group: ['"PlatformUser"."id"', '"PlatformUser"."user_id"'], // Make sure the group by fields match the table aliases used
      order: orderOption,
      raw: true,
    });

    return {
      rows: map(analytics.rows, (item) => new PlayerAnalyticResponse(item)),
      current_page: data.page,
      pages: Math.ceil(analytics.count.length / data.per_page),
    };
  }

  async getPlayerGraph(query: GetPlayerGraphQuery) {
    const getPoints = (data: Bet) => {
      const stake = data.stake / data.currency_value;

      const y = Math.log10(stake + 1) / 4;
      const x = 1 - 1 / data.odds;

      return [x, y];
    };

    const whereOption = {
      user_id: query.user_id,
    };
    const allConditions = { [Op.and]: [] };

    const sportConditions = [];

    if (query.sport_ids?.length) {
      sportConditions.push({
        ['$betOutcomes.betOutcomeAttributes.sport_id$']: {
          [Op.in]: query.sport_ids,
        },
      });
    }

    if (query.category_ids?.length) {
      sportConditions.push({
        ['$betOutcomes.betOutcomeAttributes.category_id$']: {
          [Op.in]: query.category_ids,
        },
      });
    }

    if (query.competition_ids?.length) {
      sportConditions.push({
        ['$betOutcomes.betOutcomeAttributes.competition_id$']: {
          [Op.in]: query.competition_ids,
        },
      });
    }

    if (sportConditions.length) {
      allConditions[Op.and].push({ [Op.or]: sportConditions });
    }

    if (query.bet_results?.length) {
      whereOption['result'] = {
        [Op.or]: [{ [Op.in]: query.bet_results }],
      };

      if (query.bet_results.includes('in_progress')) {
        whereOption['result'][Op.or].push({ [Op.is]: null });
      }
    }

    const typeConditions = [];

    if (query.bet_types?.length) {
      typeConditions.push({
        type: {
          [Op.in]: query.bet_types,
        },
      });
    }

    if (query.outcome_counts?.length) {
      typeConditions.push({
        ['$betAttributes.outcome_counts$']: {
          [Op.in]: query.outcome_counts,
        },
      });
    }

    if (query.date_interval?.length) {
      const conditionals = buildWhereOrCondition(query.date_interval, '"Bet"."created_at"');
      allConditions[Op.and].push({ [Op.or]: conditionals });
    }

    if (typeConditions.length) {
      allConditions[Op.and].push({ [Op.or]: typeConditions });
    }

    if (allConditions[Op.and].length) {
      whereOption[Op.and] = allConditions[Op.and];
    }

    const bets = await Bet.findAll({
      where: whereOption,
      include: [
        {
          model: BetOutcome,
          attributes: ['id'],
          where: {},
          include: [
            {
              model: BetOutcomeAttributes,
              attributes: ['id'],
            },
          ],
        },
        {
          model: BetAttributes,
          attributes: ['id'],
          // where: {},
        },
      ],
      // order: [
      //   ['stake', 'DESC'],
      //   ['Bet.odds', 'DESC'],
      // ],
    });

    const points = bets.map(getPoints);

    if (!bets.length) {
      return [];
    }

    const clusterCount = bets.length >= 20 ? 20 : Math.max(bets.length - 2, 1);

    const graph = await util.promisify(clusterize)(points, { k: clusterCount, seed: 42 });

    const getResponsePoint = (clusterData: ClusteringOutput) => {
      const [x, y] = clusterData.centroid;
      const stake = Math.pow(10, y * 4) - 1;
      const odds = 1 / (1 - x);
      return {
        x,
        y,
        stake,
        odds,
        betCount: clusterData.cluster.length,
      };
    };

    return graph.map(getResponsePoint);
  }

  async getPlayerView(user_id: number) {
    const countersForCalculatedBets = (await Bet.scope('onlyCalculated').findOne({
      raw: true,
      attributes: [
        [literal('ROUND(SUM(stake/currency_value)-SUM(win/currency_value),2)'), 'profit'],
        [literal('ROUND(SUM(win/currency_value)/SUM(stake/currency_value),4)'), 'rtp'],
      ],
      where: {
        user_id,
      },
      group: ['user_id'],
    })) as Pick<PlayerResponse, 'profit' | 'rtp'>;

    if (!countersForCalculatedBets) {
      throw new BadRequestError(`No data for user!`);
    }

    const countersForAllBets = (await Bet.findOne({
      raw: true,
      attributes: [this.getColumn(PLAYER_VIEW_MAIN_TABS.BET_COUNTS), [literal('SUM(stake/currency_value)'), 'bet_sum']],
      where: {
        user_id,
      },
      group: ['user_id'],
    })) as Pick<PlayerResponse, 'bet_counts' | 'bet_sum'>;

    const user = await PlatformUser.findByPk(user_id, { raw: true });

    const current_sign_in_ip = user?.data?.user_ip;

    return new PlayerResponse({
      ...countersForAllBets,
      ...countersForCalculatedBets,
      ...user.data,
      current_sign_in_ip,
      user_id,
    });
  }

  async getPlayerStatBySports(data: GetPlayerStatQuery) {
    const query: any = {
      attributes: [this.getColumn(data?.main_tab)],
      where: { user_id: data.user_id },
      group: ['user_id'],
    };

    if (!data.sport_id && !data.category_id) {
      query.attributes.push([col(`"betOutcomes->betOutcomeAttributes".sport_name`), 'sport_name']);
      query.attributes.push([col(`"betOutcomes->betOutcomeAttributes".sport_id`), 'sport_id']);
      query.group.push(col(`"betOutcomes->betOutcomeAttributes".sport_name`));
      query.group.push(col(`"betOutcomes->betOutcomeAttributes".sport_id`));
    }

    if (data.sport_id && !data.category_id) {
      query.attributes.push([col(`"betOutcomes->betOutcomeAttributes".category_name`), 'category_name']);
      query.attributes.push([col(`"betOutcomes->betOutcomeAttributes".category_id`), 'category_id']);
      query.group.push(col(`"betOutcomes->betOutcomeAttributes".category_name`));
      query.group.push(col(`"betOutcomes->betOutcomeAttributes".category_id`));
      query.where['$betOutcomes.betOutcomeAttributes.sport_id$'] = data.sport_id;
    }

    if (data.category_id) {
      query.attributes.push([col(`"betOutcomes->betOutcomeAttributes".competition_name`), 'competition_name']);
      query.attributes.push([col(`"betOutcomes->betOutcomeAttributes".competition_id`), 'competition_id']);
      query.group.push(col(`"betOutcomes->betOutcomeAttributes".competition_name`));
      query.group.push(col(`"betOutcomes->betOutcomeAttributes".competition_id`));
      query.where['$betOutcomes.betOutcomeAttributes.category_id$'] = data.category_id;
    }

    if (data.main_tab === PLAYER_VIEW_MAIN_TABS.RTP) {
      query.attributes.push([literal('COALESCE(SUM(pool),0) - SUM(profit)'), 'win_sum']);
      query.attributes.push([literal('COALESCE(SUM(pool),0)'), 'stake_sum']);
    }

    if ([PLAYER_VIEW_MAIN_TABS.RTP, PLAYER_VIEW_MAIN_TABS.PROFIT].includes(data.main_tab)) {
      query.where['closed'] = 1;
    }

    const betHistorySports = await Bet.findAll({
      raw: true,
      include: [
        {
          model: BetOutcome,
          required: true,
          attributes: [],
          include: [{ required: true, model: BetOutcomeAttributes, attributes: [] }],
        },
      ],
      ...query,
      order: [[literal(data.main_tab), data?.order || 'DESC']],
    });

    return betHistorySports;
  }

  async getPlayerStatByResults(data: GetPlayerStatQuery) {
    const query: any = {
      attributes: [[fn('COALESCE', col(`"Bet".result`), 'in_progress'), 'result']],

      where: {
        user_id: data.user_id,
      },
      include: [
        {
          model: BetOutcome,
          required: true,
          attributes: [],
          include: [{ required: true, model: BetOutcomeAttributes, attributes: [] }],
        },
      ],
      group: ['user_id', [fn('COALESCE', col(`"Bet".result`), 'in_progress'), 'result']],
    };

    if ([PLAYER_VIEW_MAIN_TABS.RTP, PLAYER_VIEW_MAIN_TABS.PROFIT].includes(data.main_tab)) {
      query.where['closed'] = 1;
    }

    if (data.main_tab === PLAYER_VIEW_MAIN_TABS.BET_SUM) {
      query.attributes.push([literal('ROUND(SUM(pool),2)'), 'bet_sum']);
    } else {
      query.attributes.push(this.getColumn(data?.main_tab));
    }

    const betHistoryStatuses = await Bet.findAll({
      raw: true,
      ...query,
      order: [[literal(data.main_tab), data?.order]],
    });

    const mappedBetHistoryStatuses = orderBy(
      values(BET_RESULTS_ENUM).map(
        (result) =>
          find(betHistoryStatuses, { result }) || {
            result,
            [data.main_tab]: data.main_tab === PLAYER_VIEW_MAIN_TABS.RTP ? null : 0,
          },
      ),
      [data.main_tab],
      [data?.order],
    );

    // const inProgress = find(mappedBetHistoryStatuses, { result: 'in_progress' });

    // if (inProgress) {
    //   // @ts-ignore
    //   inProgress.result = null;
    // }
    return mappedBetHistoryStatuses;
  }

  async getPlayerStatByTime(data: GetPlayerStatQuery) {
    const start_date = data.start_date || (await Bet.min('created_at'));
    const selectOption = mapValues(
      {
        [PLAYER_VIEW_MAIN_TABS.BET_COUNTS]: 'COUNT(bb_bet.id)',
        [PLAYER_VIEW_MAIN_TABS.BET_SUM]: 'SUM(bb_bet.stake/currency_value)',
        [PLAYER_VIEW_MAIN_TABS.PROFIT]: 'SUM((stake/currency_value-win/currency_value))',
        [PLAYER_VIEW_MAIN_TABS.RTP]: 'SUM(win/currency_value)/SUM(stake/currency_value)',
      },
      (value) => `COALESCE(${value},0) AS ${data.main_tab}`,
    );

    const interval = PLAYER_TIME_CHUNK_INTERVAL[data.chunk_size];

    let selectSql = template(`SELECT end_date, end_date - INTERVAL '${interval}' AS start_date, {{expression}}`)({
      expression: selectOption[data.main_tab],
    });

    if (data.main_tab === PLAYER_VIEW_MAIN_TABS.RTP) {
      selectSql += `, COALESCE(SUM(win/currency_value),0) as win_sum, COALESCE(SUM(stake/currency_value),0) as stake_sum`;
    }

    const betJoinSql = template(
      `LEFT JOIN bb_bet ON bb_bet.created_at BETWEEN dates.end_date - INTERVAL '${interval}' AND dates.end_date AND bb_bet.user_id = {{user_id}} AND {{conditional}}`,
    )({
      user_id: data.user_id,
      conditional: [PLAYER_VIEW_MAIN_TABS.PROFIT, PLAYER_VIEW_MAIN_TABS.RTP].includes(data.main_tab)
        ? 'bb_bet.closed = 1'
        : 'true',
    });

    const dates = await sequelize.query(
      `WITH RECURSIVE dates AS (
        SELECT '${format(data.end_date || new Date(), 'yyyy-MM-dd HH:mm:ss')} '::timestamp AS end_date, '${format(
        start_date as any,
        'yyyy-MM-dd HH:mm:ss',
      )} '::timestamp AS start_date
                UNION ALL
      SELECT end_date - INTERVAL '${interval}', start_date FROM dates WHERE end_date - INTERVAL '${interval}' > start_date
        )
       ${selectSql}
                FROM dates
      ${betJoinSql}             
        GROUP BY end_date
        ORDER BY end_date DESC;`,
      { type: QueryTypes.SELECT },
    );

    return dates;
  }

  async getPlayerStatByTypes(data: GetPlayerStatQuery) {
    const query: any = {
      raw: true,
      include: [
        {
          model: BetOutcome,
          required: true,
          attributes: [],
          include: [{ required: true, model: BetOutcomeAttributes, attributes: [] }],
        },
        { model: BetAttributes, required: true, attributes: [] },
      ],
      attributes: [this.getColumn(data?.main_tab), [col(`"betAttributes".outcome_counts`), 'outcome_counts'], 'type'],
      where: {
        user_id: data.user_id,
      },
      group: ['user_id', col(`"betAttributes".outcome_counts`), 'type'],
      order: [[literal(data.main_tab), data?.order || 'DESC']],
    };

    if (data.main_tab === PLAYER_VIEW_MAIN_TABS.RTP) {
      query.attributes.push([literal('SUM(pool - profit)'), 'win_sum']);
      query.attributes.push([literal('SUM(pool)'), 'stake_sum']);
    }

    if ([PLAYER_VIEW_MAIN_TABS.RTP, PLAYER_VIEW_MAIN_TABS.PROFIT].includes(data.main_tab)) {
      query.where['closed'] = 1;
    }

    const betHistoryTypes = await Bet.findAll({ ...query });

    return betHistoryTypes as unknown as BetHistoryTypesPayload[];
  }
}
