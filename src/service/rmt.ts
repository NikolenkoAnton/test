import lodash from 'lodash';
const { pick } = lodash;
import { Service } from 'typedi';
import {
  GetRmtCategoryBySport,
  GetRmtCompetitionBySport,
  GetRmtMarketDto,
  GetRmtSportByCompetitionDto,
  GetRmtSportDto,
  GetRmtTeamDto,
  SaveRmtBaseSettingsDto,
  SaveRmtBaseSettingsMarginDto,
  SaveRmtBaseSettingsOddsDto,
  SaveRmtMarketDto,
  SaveRmtPlayerDto,
  SaveRmtSportByCompetitionDto,
  SaveRmtTeamDto,
} from '../dto/rmt';
import {
  BOOLEAN_SMALLINT,
  GetRmtCategoryResponseDto,
  GetRmtCompetitionResponseDto,
  GetRmtEntityResponseDto,
  MarketResponseDto,
  SportByCategoryResponseDto,
  SportResponseDto,
  TeamResponseDto,
} from '../dto';
import {
  generalListOptions,
  generalWhereFilter,
  generalWhereFilterConditions,
  generateDateFilter,
} from '../helper/rmt';
import sequelize from '../db';
import pkg, { Model, ModelStatic, QueryTypes, Transaction } from 'sequelize';
import {
  Category,
  Competition,
  MarketGroup,
  RMTCategory,
  RMTCompetition,
  RMTMarket,
  RMTSport,
  RMTTeam,
  Sport,
  Team,
} from '../db/models';
import { BadRequestError, NotFoundError } from '../helper/errors';
import RMTBaseSettings from '../db/models/RMTBaseSettings';
import RMTBaseSettingsMargin from '../db/models/RMTBaseSettingsMargin';
import RMTBaseSettingsOdds from '../db/models/RMTBaseSettingsOdds';
import RMTPlayer from '../db/models/RMTPlayer';
import RMTPlayerTeorRtp from '../db/models/RMTPlayerTeorRtp';

const { isNil } = lodash;

@Service()
export class RmtService {
  async getRmtEntities<T>(
    body: any,
    options: {
      generateWhereSqlFilter: (body: any) => string;
      getPagesQuery: (whereFilterSql: string, dateFilter: string) => string;
      getEntityQuery: (whereFilterSql: string, orderSql: string, dateFilter: string) => string;
    },
  ): Promise<GetRmtEntityResponseDto<T>> {
    const { perPage, page, offset, sortBy, sortDir } = generalListOptions(body);

    const orderSql = `ORDER BY active DESC, ${sortBy} ${sortDir} NULLS LAST`;
    const dateFilter = generateDateFilter(body);
    const whereFilterSql = options.generateWhereSqlFilter(body);

    const pagesQuery = options.getPagesQuery(whereFilterSql, dateFilter);
    const entityQuery = options.getEntityQuery(whereFilterSql, orderSql, dateFilter);

    const count: unknown = await sequelize.query(pagesQuery, {
      type: QueryTypes.SELECT,
    });
    const pages: number = count[0]?.count || 0;

    if (pages === 0) {
      return this.dataEmptyResponse;
    }

    const rows: T[] = (await sequelize.query(entityQuery, {
      type: QueryTypes.SELECT,
      bind: [perPage, offset],
    })) as any;

    return {
      rows,
      pages: Math.ceil(pages / perPage),
      current_page: page,
    };
  }

  async saveRmtElement(
    element: any,
    model: ModelStatic<Model<any, any>>,
    rmtModel: ModelStatic<Model<any, any>>,
    rmtModelFK: string,
    dto,
    transaction: Transaction,
  ) {
    const { [rmtModelFK]: id, ...updateData } = element;
    const entityExists = await model.findByPk(id, { transaction });
    if (!entityExists) {
      throw new NotFoundError(`${dto} is not found`);
    }

    const where = { [rmtModelFK]: id };

    const existed = await rmtModel.findOne({ where, transaction });

    if (!existed) {
      await rmtModel.create({ ...element }, { transaction });
    } else {
      await existed.update(updateData, { transaction });
    }
  }

  //#region RMT Market
  async getRmtMarkets(body: GetRmtMarketDto) {
    return this.getRmtEntities<MarketResponseDto>(body, {
      generateWhereSqlFilter: this.generateWhereMarketGroupSqlFilter.bind(this),
      getPagesQuery: this.getMarketPagesQuery.bind(this),
      getEntityQuery: this.getMarketQuery.bind(this),
    });
  }

  async saveRmtMarket(data: SaveRmtMarketDto, transaction: Transaction) {
    const promises = [];
    for (const element of data.data) {
      promises.push(this.saveRmtElement(element, MarketGroup, RMTMarket, 'market_id', 'Market', transaction));
    }

    await Promise.all(promises);
  }

  private generateWhereMarketGroupSqlFilter(filter: GetRmtMarketDto): string {
    let res = generalWhereFilter(filter);

    if (filter.market) {
      if (res === '') {
        res = 'WHERE ';
      }
      res += `LOWER(mg.type) LIKE LOWER('%${filter.market}%') AND `;
    }

    return res.slice(0, -4);
  }

  private getMarketPagesQuery(whereFilterSql: string, dateFilter: string): string {
    return `SELECT COUNT(DISTINCT data.id)
          FROM (
            SELECT mg.id
            ${this.marketGeneralSql(dateFilter)}
            ${whereFilterSql}
            ${this.marketGroupSql}
          ) as data`;
  }

  private getMarketQuery(whereFilterSql: string, orderSql: string, dateFilter: string): string {
    return `SELECT
              mg.id AS market_id,
              mg.type AS market,
              s.en AS sport,
              bet_quantity,
              bet_sum,
              profit,
              rtp::DECIMAL(12, 3),
              ${this.generalSelectRMTSql}
            ${this.marketGeneralSql(dateFilter)}
            ${whereFilterSql}
            ${this.marketGroupSql}
            ${orderSql}
            limit $1 OFFSET $2`;
  }

  private marketGeneralSql(dateFilter: string): string {
    return `FROM public.bb_market_group mg
            INNER JOIN bb_sport s ON mg.sport_id = s.id
            LEFT JOIN (
              SELECT
                boa.market_id,
                greatest(SUM(bo.pool - bo.profit), 0) / SUM(bo.pool) AS rtp,
                SUM(bo.profit) AS profit
              FROM
                bb_bet_outcome_attributes boa
                LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
                LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
              WHERE
                bb.closed = 1 ${dateFilter ? `AND ${dateFilter}` : ''}
              GROUP BY
                boa.market_id
            ) AS outcome_rtp_profit ON mg.id = outcome_rtp_profit.market_id
			      LEFT JOIN (
              SELECT
                boa.market_id,
                SUM(bo.pool) AS bet_sum,
                COUNT(*) AS bet_quantity
              FROM
                bb_bet_outcome_attributes boa
                LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
                LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
              WHERE
                ${dateFilter}
              GROUP BY
                boa.market_id
            ) AS outcome_quantity_betsum ON mg.id = outcome_quantity_betsum.market_id
            LEFT JOIN bb_rmt_market r ON mg.id = r.market_id`;
  }

  private get marketGroupSql(): string {
    return `GROUP BY
              mg.id,
              mg.type,
              s.en,
              r.max_risk_bet,
              r.delay,
              r.max_win_player_event,
              r.margin,
              r.active,
              rtp,
              bet_sum,
              outcome_rtp_profit.profit,
              bet_quantity`;
  }
  //#endregion

  //#region RMT Sport
  async getRmtSportsGroupBySport(body: GetRmtSportDto) {
    return this.getRmtEntities<SportResponseDto>(body, {
      generateWhereSqlFilter: this.generateWhereSportSqlFilter.bind(this),
      getPagesQuery: this.getSportPagesQuery.bind(this),
      getEntityQuery: this.getSportQuery.bind(this),
    });
  }

  async getRmtSportsGroupByCompetition(body: GetRmtSportByCompetitionDto) {
    return this.getRmtEntities<SportByCategoryResponseDto>(body, {
      generateWhereSqlFilter: this.generateWhereCompetitionSqlFilter.bind(this),
      getPagesQuery: this.getCompetitionPagesQuery.bind(this),
      getEntityQuery: this.getCompetitionQuery.bind(this),
    });
  }

  async getRmtCategoriesBySport(body: GetRmtCategoryBySport) {
    const { sortBy, sortDir } = generalListOptions(body);
    const orderSql = `ORDER BY active DESC, ${sortBy} ${sortDir} NULLS LAST`;
    const query = `
      SELECT
        c.id AS category_id,
        c.en AS category,
        bet_quantity,
        bet_sum,
        outcome_rtp_profit.profit,
        rtp::DECIMAL(12, 3),
        ${this.generalSelectRMTSql}
        FROM bb_category c
      LEFT JOIN (
        SELECT
          boa.category_id,
          greatest(SUM(bo.pool - bo.profit), 0) / SUM(bo.pool) AS rtp,
          SUM(bo.profit) AS profit
        FROM
          bb_bet_outcome_attributes boa
          LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
          LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
        WHERE
          bb.closed = $1
        GROUP BY
          boa.category_id
          ) AS outcome_rtp_profit ON c.id = outcome_rtp_profit.category_id
        LEFT JOIN (
          SELECT
            boa.category_id,
            SUM(bo.pool) AS bet_sum,
            COUNT(*) AS bet_quantity
          FROM
            bb_bet_outcome_attributes boa
            LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
            LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
          GROUP BY
            boa.category_id
          ) AS outcome_quantity_betsum ON c.id = outcome_quantity_betsum.category_id
        LEFT JOIN bb_rmt_category r ON c.id = r.category_id
        WHERE c.sport_id = $2
        GROUP BY
          c.id,
          c.en,
          r.max_risk_bet,
          r.delay,
          r.max_win_player_event,
          r.margin,
          r.active,
          rtp,
          bet_quantity,
          bet_sum,
          outcome_rtp_profit.profit
      ${orderSql}`;

    const rows: GetRmtCategoryResponseDto[] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: [BOOLEAN_SMALLINT.TRUE, body.sport_id],
    });

    return rows;
  }

  async getRmtCompetitionsByCategory(body: GetRmtCompetitionBySport) {
    const { sortBy, sortDir } = generalListOptions(body);
    const orderSql = `ORDER BY active DESC, ${sortBy} ${sortDir} NULLS LAST`;
    const query = `
      SELECT 
        c.id AS competition_id, 
        c.en AS competition, 
        bet_quantity, 
        bet_sum, 
        outcome_rtp_profit.profit, 
        rtp::DECIMAL(12, 3), 
        ${this.generalSelectRMTSql}
      FROM 
        bb_competition c 
        LEFT JOIN (
          SELECT 
            boa.competition_id, 
            greatest(SUM(bo.pool - bo.profit), 0) / SUM(bo.pool) AS rtp, 
            SUM(bo.profit) AS profit 
          FROM 
            bb_bet_outcome_attributes boa 
            LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id 
            LEFT JOIN bb_bet bb ON bo.bet_id = bb.id 
          WHERE 
            bb.closed = 1 
          GROUP BY 
            boa.competition_id
        ) AS outcome_rtp_profit ON c.id = outcome_rtp_profit.competition_id 
        LEFT JOIN (
          SELECT 
            boa.competition_id, 
            SUM(bo.pool) AS bet_sum, 
            COUNT(*) AS bet_quantity 
          FROM 
            bb_bet_outcome_attributes boa 
            LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id 
            LEFT JOIN bb_bet bb ON bo.bet_id = bb.id 
          WHERE 
            bb.closed = $1
          GROUP BY 
            boa.competition_id
        ) AS rtp ON c.id = rtp.competition_id 
        LEFT JOIN bb_rmt_competition r ON c.id = r.competition_id 
      WHERE 
        c.category_id = $2 
      GROUP BY 
        c.id, 
        c.en, 
        r.max_risk_bet, 
        r.delay, 
        r.max_win_player_event, 
        r.margin, 
        r.active,
        rtp, 
        bet_quantity, 
        bet_sum, 
        outcome_rtp_profit.profit 
      ${orderSql}`;

    const rows: GetRmtCompetitionResponseDto[] = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: [BOOLEAN_SMALLINT.TRUE, body.category_id],
    });

    return rows;
  }

  async saveSport(data, transaction) {
    if (data.sports.length) {
      for (const sport of data.sports) {
        const parentRmtOldData = await RMTSport.findOne({
          where: { sport_id: sport.sport_id },
          raw: true,
          transaction,
        });
        const where = { sport_id: sport.sport_id };
        await this.updateOrCreateRMTItem(RMTSport, where, parentRmtOldData, sport, transaction);

        const categoriesNested = await Category.findAll({
          where: { sport_id: sport.sport_id },
          attributes: [[pkg.fn('DISTINCT', pkg.col('id')), 'id']],
          raw: true,
        });

        if (!categoriesNested.length) {
          continue;
        }

        for (const category of categoriesNested) {
          const where = { category_id: category.id };
          await this.updateOrCreateRMTItem(RMTCategory, where, parentRmtOldData, sport, transaction);

          const competitionsNested = await Competition.findAll({ where, raw: true });

          if (!competitionsNested.length) {
            continue;
          }

          for (const competition of competitionsNested) {
            await this.updateOrCreateRMTItem(
              RMTCompetition,
              { competition_id: competition.id },
              parentRmtOldData,
              sport,
              transaction,
            );
          }
        }
      }
    }

    if (data.categories.length) {
      for (const category of data.categories) {
        const parentRmtData = await RMTCategory.findOne({
          where: { category_id: category.category_id },
          raw: true,
          transaction,
        });
        await this.updateOrCreateRMTItem(
          RMTCategory,
          { category_id: category.category_id },
          parentRmtData,
          category,
          transaction,
        );

        const competitionsNested = await Competition.findAll({
          where: { category_id: category.category_id },
          attributes: [[pkg.fn('DISTINCT', pkg.col('id')), 'id']],
          raw: true,
        });

        if (!competitionsNested.length) {
          continue;
        }

        for (const competition of competitionsNested) {
          await this.updateOrCreateRMTItem(
            RMTCompetition,
            { competition_id: competition.id },
            parentRmtData,
            category,
            transaction,
          );
        }
      }
    }

    if (data.competitions.length) {
      for (const competition of data.competitions) {
        const parentRmtData = await RMTCompetition.findOne({
          where: { competition_id: competition.competition_id },
          raw: true,
          transaction,
        });

        await this.updateOrCreateRMTItem(
          RMTCompetition,
          { competition_id: competition.competition_id },
          parentRmtData,
          competition,
          transaction,
        );
      }
    }
  }

  private async updateOrCreateRMTItem(model, where, parentRmtItemData, newData, transaction) {
    const rmtItem = await model.findOne({ where, transaction });

    if (rmtItem) {
      const toUpdate: any = {};

      if (!rmtItem.max_risk_bet || parentRmtItemData.max_risk_bet === rmtItem.max_risk_bet) {
        toUpdate.max_risk_bet = newData.max_risk_bet;
      }
      if (!rmtItem.delay || parentRmtItemData.delay === rmtItem.delay) {
        toUpdate.delay = newData.delay;
      }
      if (!rmtItem.max_win_player_event || parentRmtItemData.max_win_player_event === rmtItem.max_win_player_event) {
        toUpdate.max_win_player_event = newData.max_win_player_event;
      }
      if (!rmtItem.margin || parentRmtItemData.margin === rmtItem.margin) {
        toUpdate.margin = newData.margin;
      }
      if (!rmtItem.active || parentRmtItemData.active === rmtItem.active) {
        toUpdate.active = newData.active;
      }

      if (Object.keys(toUpdate).length) {
        await rmtItem.update(toUpdate, { transaction });
      }
    } else {
      await model.create(
        { ...pick(newData, 'max_risk_bet', 'delay', 'max_win_player_event', 'margin', 'active'), ...where },
        { transaction },
      );
    }
  }

  private generateWhereSportSqlFilter(filter: GetRmtSportDto): string {
    const res = generalWhereFilter(filter);
    return res.slice(0, -4);
  }

  private generateWhereCompetitionSqlFilter(filter: GetRmtSportByCompetitionDto): string {
    let res = generalWhereFilter(filter);

    if (filter.competition) {
      if (res === '') {
        res = 'WHERE ';
      }
      res += `LOWER(c.en) LIKE LOWER('%${filter.competition}%') AND `;
    }

    return res.slice(0, -4);
  }

  private getSportQuery(whereFilterSql: string, orderSql: string, dateFilter: string): string {
    return `SELECT
              s.id AS sport_id,
              s.en AS sport,
              bet_quantity,
              bet_sum,
              profit,
              rtp::DECIMAL(12, 3),
              ${this.generalSelectRMTSql}
              ${this.sportGeneralSql(dateFilter)}
              ${whereFilterSql}
              ${this.sportGroupSql}
              ${orderSql}
              LIMIT $1 OFFSET $2`;
  }

  private sportGeneralSql(dateFilter: string): string {
    return `FROM bb_sport s
            LEFT JOIN (
              SELECT
                boa.sport_id,
                greatest(SUM(bo.pool - bo.profit), 0) / SUM(bo.pool) AS rtp,
                SUM(bo.profit) AS profit
              FROM
                bb_bet_outcome_attributes boa
                LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
                LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
              WHERE
                bb.closed = 1 ${dateFilter ? `AND ${dateFilter}` : ''}
              GROUP BY
                boa.sport_id
            ) AS outcome_rtp_profit ON s.id = outcome_rtp_profit.sport_id
			      LEFT JOIN (
              SELECT
                boa.sport_id,
                SUM(bo.pool) AS bet_sum,
                COUNT(*) AS bet_quantity
              FROM
                bb_bet_outcome_attributes boa
                LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
                LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
              WHERE
                ${dateFilter}
              GROUP BY
                boa.sport_id
            ) AS outcome_quantity_betsum ON s.id = outcome_quantity_betsum.sport_id
          LEFT JOIN bb_rmt_sport r ON s.id = r.sport_id`;
  }

  private get sportGroupSql(): string {
    return `GROUP BY
            s.en,
            s.id,
            r.max_risk_bet,
            r.delay,
            r.max_win_player_event,
            r.margin,
            r.active,
            bet_quantity,
            bet_sum,
            outcome_rtp_profit.profit,
            rtp`;
  }

  private getSportPagesQuery(whereFilterSql: string, dateFilter: string): string {
    return `SELECT COUNT(DISTINCT data.id)
          FROM (
            SELECT s.id
            ${this.sportGeneralSql(dateFilter)}
            ${whereFilterSql}
            ${this.sportGroupSql}
          ) as data`;
  }

  private getCompetitionPagesQuery(whereFilterSql: string, dateFilter: string): string {
    return `SELECT COUNT(DISTINCT data.id)
          FROM (
            SELECT c.id
            ${this.competitionGeneralSql(dateFilter)}
            ${whereFilterSql}
            ${this.competitionGroupSql}
          ) as data`;
  }

  private getCompetitionQuery(whereFilterSql: string, orderSql: string, dateFilter: string): string {
    return `SELECT
              s.en AS sport,
              bc.en AS category,
              c.en AS competition,
              c.id AS competition_id,
              bet_quantity,
              bet_sum,
              outcome_rtp_profit.profit,
              rtp::DECIMAL(12, 3),
              ${this.generalSelectRMTSql}
            ${this.competitionGeneralSql(dateFilter)}
            ${whereFilterSql}
            ${this.competitionGroupSql}
            ${orderSql}
            LIMIT $1 OFFSET $2`;
  }

  private competitionGeneralSql(dateFilter): string {
    return `FROM bb_competition c
            INNER JOIN bb_category bc ON c.category_id = bc.id
            INNER JOIN bb_sport s ON c.sport_id = s.id
            LEFT JOIN (
              SELECT
                boa.competition_id,
                greatest(SUM(bo.pool - bo.profit), 0) / SUM(bo.pool) AS rtp,
                SUM(bo.profit) AS profit
              FROM
                  bb_bet_outcome_attributes boa
                  LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
                  LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
              WHERE
                bb.closed = 1 ${dateFilter ? `AND ${dateFilter}` : ''}
              GROUP BY
                boa.competition_id
              ) AS outcome_rtp_profit ON c.id = outcome_rtp_profit.competition_id
            LEFT JOIN (
              SELECT
                boa.competition_id,
                SUM(bo.pool) AS bet_sum,
                COUNT(*) AS bet_quantity
              FROM
                  bb_bet_outcome_attributes boa
                  LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
                  LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
              WHERE
                ${dateFilter}
              GROUP BY
                boa.competition_id
              ) AS outcome_quantity_betsum ON c.id = outcome_quantity_betsum.competition_id
            LEFT JOIN bb_rmt_competition r ON c.id = r.competition_id`;
  }

  private get competitionGroupSql(): string {
    return `GROUP BY
              c.id,
              c.en,
              bc.en,
              s.en,
              r.max_risk_bet,
              r.delay,
              r.max_win_player_event,
              r.margin,
              r.active,
              bet_quantity,
              bet_sum,
              outcome_rtp_profit.profit,
              rtp`;
  }
  //#endregion

  //#region RMT Teams
  async getRmtTeams(body: GetRmtTeamDto) {
    return this.getRmtEntities<TeamResponseDto>(body, {
      generateWhereSqlFilter: this.generateWhereTeamGroupSqlFilter.bind(this),
      getPagesQuery: this.getTeamPagesQuery.bind(this),
      getEntityQuery: this.getTeamQuery.bind(this),
    });
  }

  async saveRmtTeam(data: SaveRmtTeamDto, transaction: Transaction) {
    const promises = [];
    for (const element of data.data) {
      promises.push(this.saveRmtElement(element, Team, RMTTeam, 'team_id', 'Team', transaction));
    }

    await Promise.all(promises);
  }

  private generateWhereTeamGroupSqlFilter(filter: GetRmtTeamDto): string {
    const rtp = 'COALESCE(rtp_ht::DECIMAL(12, 3), 0) + COALESCE(rtp_at::DECIMAL(12, 3), 0)';
    const betSum = 'COALESCE(bet_sum_ht, 0) + COALESCE(bet_sum_at, 0)';
    const profit = 'COALESCE(profit_ht, 0) + COALESCE(profit_at, 0)';
    const betQuantity = 'COALESCE(bet_quantity_ht, 0) + COALESCE(bet_quantity_at, 0)';

    const filters = [];

    const numericFields = [
      { field: rtp, min: 'rtp_min', max: 'rtp_max' },
      { field: betSum, min: 'bet_sum_min', max: 'bet_sum_max' },
      { field: profit, min: 'profit_min', max: 'profit_max' },
      { field: betQuantity, min: 'bet_quantity_min', max: 'bet_quantity_max' },
    ];

    const conditions = generalWhereFilterConditions(numericFields, filter);

    if (filter.team) {
      conditions.push(`LOWER(t.en) LIKE LOWER('%${filter.team}%')`);
    }

    if (conditions.length > 0) {
      filters.push(conditions.join(' AND '));
    }

    return filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
  }

  private getTeamPagesQuery(whereFilterSql, dateFilter): string {
    return `SELECT COUNT(DISTINCT data.id)
          FROM (
            SELECT t.id
            ${this.teamsGeneralSql(dateFilter)}
            ${whereFilterSql}
            ${this.teamsGroupSql}
          ) as data`;
  }

  private getTeamQuery(whereFilterSql: string, orderSql: string, dateFilter: string): string {
    return `SELECT
            t.id AS team_id,
            t.en AS team,
            s.en AS sport,
            COALESCE(bet_quantity_ht, 0) + COALESCE(bet_quantity_at, 0) as bet_quantity,
            COALESCE(bet_sum_ht, 0) + COALESCE(bet_sum_at, 0) as bet_sum,
            COALESCE(profit_ht, 0) + COALESCE(profit_at, 0) as profit,
            COALESCE(rtp_ht::DECIMAL(12, 3), 0) + COALESCE(rtp_at::DECIMAL(12, 3), 0) as rtp,
            ${this.generalSelectRMTSql}
            ${this.teamsGeneralSql(dateFilter)}
            ${whereFilterSql}
            ${this.teamsGroupSql}
            ${orderSql}
            limit $1 OFFSET $2`;
  }

  get teamsGroupSql() {
    return `GROUP BY
      t.id,
      t.en,
      s.en,
      r.max_risk_bet,
      r.delay,
      r.max_win_player_event,
      r.margin,
      r.active,
      bet_sum_ht,
      bet_sum_at,
      rtp_ht,
      rtp_at,
      profit_ht,
      profit_at,
      bet_quantity_ht,
      bet_quantity_at`;
  }

  teamsGeneralSql(dateFilter: string) {
    return `
    FROM
      public.bb_team t
      INNER JOIN bb_sport s ON t.sport_id = s.id
      LEFT JOIN (
        SELECT
          boa.home_team_id,
          greatest(SUM(bo.pool - bo.profit), 0) / SUM(bo.pool) AS rtp_ht,
          SUM(bo.profit) AS profit_ht
        FROM
          bb_bet_outcome_attributes boa
          LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
          LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
        WHERE
          bb.closed = 1 ${dateFilter ? `AND ${dateFilter}` : ''}
        GROUP BY
          boa.home_team_id
      ) AS outcome_rtp_profit_home_team ON t.id = outcome_rtp_profit_home_team.home_team_id
      LEFT JOIN (
        SELECT
          boa.away_team_id,
          greatest(SUM(bo.pool - bo.profit), 0) / SUM(bo.pool) AS rtp_at,
          SUM(bo.profit) AS profit_at
        FROM
          bb_bet_outcome_attributes boa
          LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
          LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
        WHERE
          bb.closed = 1 ${dateFilter ? `AND ${dateFilter}` : ''}
        GROUP BY
          boa.away_team_id
      ) AS outcome_rtp_profit_away_team ON t.id = outcome_rtp_profit_away_team.away_team_id
      LEFT JOIN (
        SELECT
          boa.home_team_id,
          SUM(bo.pool) AS bet_sum_ht,
          COUNT(*) AS bet_quantity_ht
        FROM
          bb_bet_outcome_attributes boa
          LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
          LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
        ${dateFilter ? `WHERE ${dateFilter}` : ''}
        GROUP BY
          boa.home_team_id
      ) AS outcome_quantity_betsum_home_team ON t.id = outcome_quantity_betsum_home_team.home_team_id
      LEFT JOIN (
        SELECT
          boa.away_team_id,
          SUM(bo.pool) AS bet_sum_at,
          COUNT(*) AS bet_quantity_at
        FROM
          bb_bet_outcome_attributes boa
          LEFT JOIN bb_bet_outcome bo ON boa.bet_outcome_id = bo.id
          LEFT JOIN bb_bet bb ON bo.bet_id = bb.id
        ${dateFilter ? `WHERE ${dateFilter}` : ''}
        GROUP BY
          boa.away_team_id
      ) AS outcome_quantity_betsum_away_team ON t.id = outcome_quantity_betsum_away_team.away_team_id
      LEFT JOIN bb_rmt_team r ON t.id = r.team_id`;
  }
  //#endregion

  //#region RMT Base settings
  async saveRmtBaseSettings(data: SaveRmtBaseSettingsDto, transaction: Transaction) {
    await RMTBaseSettings.destroy({ where: {}, truncate: true, cascade: true, transaction });
    data['max_win'] = 999999.999999; // temp solution before front resolution
    const { odds, margins, ...base } = data;

    const baseSettings = await RMTBaseSettings.create({ ...base }, { transaction });

    if (odds?.length) {
      await Promise.all(
        data.odds.map((odd) =>
          RMTBaseSettingsOdds.create(
            {
              rmt_base_settings_id: baseSettings.id,
              from: odd.from,
              to: odd.to,
              step: odd.step,
            },
            { transaction },
          ),
        ),
      );
    }

    if (margins?.length) {
      await Promise.all(
        data.margins.map((m) =>
          RMTBaseSettingsMargin.create(
            {
              rmt_base_settings_id: baseSettings.id,
              from: m.from,
              to: m.to,
              margin_percent: m.margin_percent,
            },
            { transaction },
          ),
        ),
      );
    }
  }

  async getRmtBaseSettings(): Promise<RMTBaseSettings> {
    const base: RMTBaseSettings = (
      await RMTBaseSettings.findOne({
        attributes: { exclude: ['id', 'created_at', 'updated_at'] },
        include: [
          {
            model: RMTBaseSettingsOdds,
            attributes: { exclude: ['id', 'rmt_base_settings_id'] },
          },
          {
            model: RMTBaseSettingsMargin,
            attributes: { exclude: ['id', 'rmt_base_settings_id'] },
          },
        ],
        order: [
          ['odds', 'id', 'ASC'],
          ['margins', 'id', 'ASC'],
        ],
      })
    )?.toJSON();

    if (!base) {
      return this.defaultRMTBase;
    }

    if (!base.odds.length) {
      base.odds = [
        {
          from: 1,
          to: null,
          step: null,
        } as RMTBaseSettingsOdds,
      ];
    }

    if (!base.margins.length) {
      base.margins = [
        {
          from: 1,
          to: 0,
          margin_percent: 0,
        } as RMTBaseSettingsMargin,
      ];
    }

    return base;
  }

  private get defaultRMTBase(): RMTBaseSettings {
    return {
      basic_risk_per_bet: 1000,
      minimal_max_risk_per_bet: 1,
      maximal_max_risk_per_bet: 10000,
      min_bet_per_bet: 0.1,
      max_bet_per_bet: 100000,
      odd_events_count: 1.05,
      odd_events_count_power: 2,
      max_risk_combos_systems: 40000,
      basic_delay: 5,
      min_delay: 1,
      max_delay: 15,
      show_market_sum_limit: 0.05,
      show_market_time_limit: 360,
      basic_max_risk_per_event: 5000,
      minimal_max_risk_per_event: 10,
      maximal_max_risk_per_event: 100000,
      odds: [
        {
          from: 1.01,
          to: null,
          step: null,
        },
      ],
      margins: [
        {
          from: 1,
          to: 0,
          margin_percent: 0,
        },
      ],
    } as unknown as RMTBaseSettings;
  }

  validateBaseSettings(data: SaveRmtBaseSettingsDto) {
    this.validateMargins(data.margins);
    this.validateOdds(data.odds);
  }

  private validateMargins(margins: SaveRmtBaseSettingsMarginDto[] = []) {
    const len = margins.length;
    const marginRangeStart = 1;
    const marginRangeEnd = 0;

    if (!len) {
      return;
    }
    if (
      margins[0].from !== marginRangeStart ||
      margins[len - 1].to !== marginRangeEnd ||
      margins[0].from < margins[0].to
    ) {
      throw new BadRequestError('margins is not valid');
    }

    let targetValue = margins[0].to;

    for (let i = 1; i < len; i++) {
      if (margins[i].from !== targetValue || margins[i].from < margins[i].to) {
        throw new BadRequestError('margins is not valid');
      }
      targetValue = margins[i].to;
    }

    return;
  }

  private validateOdds(odds: SaveRmtBaseSettingsOddsDto[] = []) {
    const oddsMinFromValue = 1.01;
    const len = odds.length;
    if (!len) {
      return;
    }
    if (odds.length === 1 && odds[0].from === oddsMinFromValue) {
      return;
    }
    if (odds[0].from !== oddsMinFromValue || odds[0].from > odds[0].to) {
      throw new BadRequestError('odds is not valid');
    }

    let targetValue = odds[0].to;

    for (let i = 1; i < len; i++) {
      if (odds[i].from !== targetValue || odds[i].from > odds[i].to) {
        throw new BadRequestError('odds is not valid');
      }
      targetValue = odds[i].to;
    }

    return;
  }

  //#endregion

  //#region RMT player
  async saveRmtPlayer(data: SaveRmtPlayerDto, transaction: Transaction) {
    const { rtp_theoretical, profit, num_of_bets } = data;

    await this.savePlayerProfitBets({ profit, num_of_bets }, transaction);
    await this.saveRmtPlayerRtp({ ...rtp_theoretical }, transaction);
  }

  private async savePlayerProfitBets(data, transaction) {
    const flattenedArray = [];
    for (const [section, groups] of Object.entries(data)) {
      for (const [group, innerObject] of Object.entries(groups)) {
        const flattenedObject = { section, group };
        Object.assign(flattenedObject, innerObject);
        flattenedArray.push(flattenedObject);
      }
    }

    if (!flattenedArray.length) {
      return;
    }

    await RMTPlayer.destroy({ where: {}, transaction });

    return Promise.all(
      flattenedArray.map((el) => {
        const { section, group, ...updateData } = el;
        return RMTPlayer.create({ section, group, ...updateData }, { transaction });
      }),
    );
  }

  async saveRmtPlayerRtp(data, transaction: Transaction) {
    const promises = [];
    await RMTPlayerTeorRtp.destroy({ where: {}, transaction });

    for (const [key, value] of Object.entries(data) as any) {
      value.map((v) => promises.push(RMTPlayerTeorRtp.create({ ...v, group: key }, { transaction })));
    }

    return Promise.all(promises);
  }

  async getRmtPlayer() {
    const betsProfit = await this.getRmtPlayerProfitBets();
    const rtp = await this.getRmtPlayerRtp();

    return { ...betsProfit, rtp_theoretical: rtp };
  }

  private async getRmtPlayerProfitBets() {
    const flatten = await RMTPlayer.findAll({
      attributes: {
        exclude: ['id', 'created_at', 'updated_at'],
      },
      raw: true,
    });

    if (!flatten.length) {
      return this.rmtPlayerDefaultProfitBetsValues;
    }

    return flatten.reduce((acc, item) => {
      const { section, group, ...rest } = item;
      acc[section] = acc[section] || {};
      acc[section][group] = { ...rest };
      return acc;
    }, {});
  }

  async getRmtPlayerRtp() {
    const flatten = await RMTPlayerTeorRtp.findAll({
      attributes: {
        exclude: ['id', 'created_at', 'updated_at'],
      },
      raw: true,
    });

    if (!flatten.length) {
      return this.rmtPlayerDefaultTRtpValues;
    }

    return flatten.reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      const { group, ...rest } = item;
      acc[item.group].push(rest);
      return acc;
    }, {});
  }

  private get rmtPlayerDefaultTRtpValues() {
    return {
      max_risk_bet: [
        {
          from: 0,
          to: 100,
          k: 1,
        },
      ],
      delay: [
        {
          from: 0,
          to: 100,
          k: 1,
        },
      ],
      max_win_event: [
        {
          from: 0,
          to: 100,
          k: 1,
        },
      ],
      margin: [
        {
          from: 0,
          to: 100,
          k: 1,
        },
      ],
    };
  }
  private get rmtPlayerDefaultProfitBetsValues() {
    return {
      profit: {
        max_risk_bet: {
          k_from: 0.1,
          k_to: 10,
          nz_from: -1000,
          nz_to: 1000,
        },
        delay: {
          k_from: 0.1,
          k_to: 10,
          nz_from: -1000,
          nz_to: 1000,
        },
        max_win_event: {
          k_from: 0.1,
          k_to: 10,
          nz_from: -1000,
          nz_to: 1000,
        },
        margin: {
          k_from: 0.1,
          k_to: 10,
          nz_from: -1000,
          nz_to: 1000,
        },
      },
      num_of_bets: {
        max_risk_bet: {
          k_from: 0.1,
          k_to: 10,
          nz_from: 100,
          nz_to: 100,
        },
        delay: {
          k_from: 0.1,
          k_to: 10,
          nz_from: 100,
          nz_to: 100,
        },
        max_win_event: {
          k_from: 0.1,
          k_to: 10,
          nz_from: 100,
          nz_to: 100,
        },
        margin: {
          k_from: 0.1,
          k_to: 10,
          nz_from: 100,
          nz_to: 100,
        },
      },
    };
  }
  //#endregion

  private get dataEmptyResponse() {
    return {
      rows: [],
      pages: 0,
      current_page: 0,
    };
  }

  private get generalSelectRMTSql() {
    return `r.max_risk_bet,
      r.delay,
      r.max_win_player_event,
      r.margin,
      CASE
    when r.active IS NULL THEN 1
    ELSE r.active
    END active`;
  }
}
