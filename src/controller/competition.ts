import { Body, Post } from 'routing-controllers';
import { Op, WhereOptions } from 'sequelize';
import { ApiOperationPost } from 'swagger-express-ts';
import { searchCompetitions } from '../../swagger/operations/competition';
import { Competition, Game } from '../db/models';
import { SearchCategoriesResponseDto, SearchCompetitionsDto } from '../dto';
import { DefaultController } from '../helper/custom-controller.decorator';

@DefaultController('/competition', 'Competition')
export class CompetitionController {
  @ApiOperationPost(searchCompetitions)
  @Post('competitions/search')
  async searchCompetitions(@Body() body: SearchCompetitionsDto): Promise<SearchCategoriesResponseDto> {
    const where: WhereOptions = {};

    if (body.search) {
      where.en = {
        [Op.iLike]: `%${body.search}%`,
      };
    }
    if (body.sport_id) {
      where.sport_id = {
        [Op.in]: Array.isArray(body.sport_id) ? body.sport_id : [body.sport_id],
      };
    }
    if (body.category_id) {
      where.category_id = {
        [Op.in]: Array.isArray(body.category_id) ? body.category_id : [body.category_id],
      };
    }
    if (body.game_id) {
      where['$games.id$'] = {
        [Op.in]: Array.isArray(body.game_id) ? body.game_id : [body.game_id],
      };
    }

    const competitions = await Competition.findAll({
      subQuery: false,
      include: [
        {
          model: Game,
        },
      ],
      where,
      limit: 50,
    });
    return {
      rows: competitions.map((competition) => {
        return {
          id: competition.id,
          name: competition.en,
        };
      }),
    };
  }
}
