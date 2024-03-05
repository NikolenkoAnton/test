import { Body, Get, Post, QueryParam } from 'routing-controllers';
import { Op, WhereOptions } from 'sequelize';
import { ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import {
  getCountries,
  getShortCategory,
  getShortCompetition,
  getShortEvent,
  getShortSport,
  getSports,
  searchSports,
} from '../../swagger/operations/data';
import config from '../config';
import { Category, Competition, Country, Game, GameTeam, Sport, Team } from '../db/models';
import {
  GetSportsDto,
  GetSportsResponseDto,
  SearchSportsDto,
  SearchSportsResponse,
  SearchSportsResponseDto,
} from '../dto';
import { DefaultController } from '../helper/custom-controller.decorator';
import { NoDataError } from '../helper/errors';

@DefaultController('/data', 'Data')
export class DataController {
  @ApiOperationPost(getSports)
  @Post('event')
  async getSports(@Body() body: GetSportsDto): Promise<GetSportsResponseDto> {
    const where: WhereOptions = {};

    if (body.search) {
      where.en = {
        [Op.iLike]: `%${body.search}%`,
      };
    }

    const sportsCount: number = await Sport.count({
      where: where,
    });

    const page: number = body.page || 1;
    const perPage: number = body.per_page || config.DEFAULT_PAGINATION_SIZE;

    const sports: Sport[] = await Sport.findAll({
      where: where,
      order: ['weight', 'en'],
      limit: perPage,
      offset: (page - 1) * perPage,
      raw: true,
    });

    if (!sports.length) {
      throw new NoDataError();
    }

    return {
      rows: sports,
      pages: Math.ceil(sportsCount / perPage),
      current_page: page,
    };
  }

  @ApiOperationPost(searchSports)
  @Post('event/search')
  async searchSports(@Body() body: SearchSportsDto): Promise<SearchSportsResponseDto> {
    const where: WhereOptions = {};

    if (body.search) {
      where.en = {
        [Op.iLike]: `%${body.search}%`,
      };
    }
    if (body.category_id) {
      where['$categories.id$'] = {
        [Op.in]: Array.isArray(body.category_id) ? body.category_id : [body.category_id],
      };
    }
    if (body.competition_id) {
      where['$competitions.id$'] = {
        [Op.in]: Array.isArray(body.competition_id) ? body.competition_id : [body.competition_id],
      };
    }
    if (body.game_id) {
      where['$competitions.games.id$'] = {
        [Op.in]: Array.isArray(body.game_id) ? body.game_id : [body.game_id],
      };
    }

    const sports = await Sport.findAll({
      subQuery: !body.category_id && !body.competition_id && !body.game_id,
      include: [
        {
          model: Category,
        },
        {
          model: Competition,
          include: [
            {
              model: Game,
            },
          ],
        },
      ],
      where,
      limit: 50,
    });
    return {
      rows: sports.map((sport) => {
        return {
          id: sport.id,
          name: sport.en,
        };
      }),
    };
  }

  @ApiOperationGet(getCountries)
  @Get('country')
  async getCountry(): Promise<Country[]> {
    const results = await Country.findAll();

    return results;
  }

  @ApiOperationGet(getShortSport)
  @Get('event-short')
  async getShortSport(): Promise<Sport[]> {
    const results = await Sport.findAll({
      attributes: ['id', ['en', 'name']],
      order: [['en', 'asc']],
      raw: true,
    });

    return results;
  }

  @ApiOperationGet(getShortCategory)
  @Get('category-short')
  async getShortCategory(@QueryParam('sport_id', { required: true }) sport_id: number): Promise<Category[]> {
    const results = await Category.findAll({
      where: {
        sport_id,
      },
      attributes: ['id', ['en', 'name']],
      order: [['en', 'asc']],
      raw: true,
    });

    return results;
  }

  @ApiOperationGet(getShortCompetition)
  @Get('competition-short')
  async getShortCompetition(
    @QueryParam('category_id', { required: true }) category_id: number,
  ): Promise<Competition[]> {
    const results = await Competition.findAll({
      where: {
        category_id,
      },
      attributes: ['id', ['en', 'name']],
      order: [['en', 'asc']],
      raw: true,
    });

    return results;
  }

  @ApiOperationGet(getShortEvent)
  @Get('event-short')
  async getShortEvent(
    @QueryParam('competition_id', { required: true }) competition_id: number,
  ): Promise<SearchSportsResponse[]> {
    const data = await Game.findAll({
      include: [
        {
          model: GameTeam,
          as: 'homeTeams',
          where: {
            type: 'home',
          },
          include: [
            {
              model: Team,
              attributes: [['en', 'name']],
            },
          ],
          attributes: ['id'],
        },
        {
          model: GameTeam,
          as: 'awayTeams',
          where: {
            type: 'away',
          },
          include: [
            {
              model: Team,
              attributes: [['en', 'name']],
            },
          ],
          attributes: ['id'],
        },
      ],
      where: {
        competition_id,
      },
      attributes: ['id'],
      order: [['name', 'asc']],
      raw: true,
    });

    const results: SearchSportsResponse[] = data.map((data: any) => ({
      id: data.id,
      name: data['homeTeams.team.name'] + ' - ' + data['awayTeams.team.name'],
    }));

    return results;
  }
}
