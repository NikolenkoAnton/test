import { Body, Post } from 'routing-controllers';
import { Op } from 'sequelize';
import { ApiOperationPost } from 'swagger-express-ts';
import { searchGames } from '../../swagger/operations/game';
import { Category, Competition, Game, GameTeam, Sport, Team } from '../db/models';
import { SearchGamesDto, SearchGamesResponseDto } from '../dto';
import { DefaultController } from '../helper/custom-controller.decorator';

@DefaultController('/game', 'Game')
export class GameController {
  @ApiOperationPost(searchGames)
  @Post('games/search')
  async searchGames(@Body() body: SearchGamesDto): Promise<SearchGamesResponseDto> {
    const where: any = {};

    const competitors = body.search.includes('vs') ? body.search.split('vs').map((x) => x.trim()) : body.search;

    if (body.search) {
      where[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${body.search}%`,
          },
        },
        {
          '$awayTeams.team.en$': Array.isArray(competitors)
            ? {
                [Op.in]: competitors,
              }
            : {
                [Op.iLike]: `%${body.search}%`,
              },
        },
        {
          '$homeTeams.team.en$': Array.isArray(competitors)
            ? {
                [Op.in]: competitors,
              }
            : {
                [Op.iLike]: `%${body.search}%`,
              },
        },
      ];
    }
    if (body.competition_id) {
      where.competition_id = {
        [Op.in]: Array.isArray(body.competition_id) ? body.competition_id : [body.competition_id],
      };
    }
    if (body.sport_id) {
      where['$competition.sport.id$'] = {
        [Op.in]: Array.isArray(body.sport_id) ? body.sport_id : [body.sport_id],
      };
    }
    if (body.category_id) {
      where['$competition.category.id$'] = {
        [Op.in]: Array.isArray(body.category_id) ? body.category_id : [body.category_id],
      };
    }

    const games = await Game.findAll({
      subQuery: !!body.competition_id && !!body.sport_id && !!body.category_id,
      include: [
        {
          model: Competition,
          include: [
            {
              model: Sport,
            },
            {
              model: Category,
            },
          ],
        },
        {
          model: GameTeam,
          as: 'homeTeams',
          where: {
            type: 'home',
          },
          include: [
            {
              model: Team,
            },
          ],
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
            },
          ],
        },
      ],
      where,
      limit: 50,
    });
    return {
      rows: games.map((game: any) => {
        return {
          id: game.id,
          name: game.name || `${game.homeTeams[0].team.en} vs ${game.awayTeams[0].team.en}`,
        };
      }),
    };
  }
}
