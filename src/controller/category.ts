import { Body, Post } from 'routing-controllers';
import { ApiOperationPost } from 'swagger-express-ts';

import { Op, WhereOptions } from 'sequelize';
import { searchCategories } from '../../swagger/operations/category';
import { Category, Competition, Game } from '../db/models';
import { SearchCategoriesDto, SearchCategoriesResponseDto } from '../dto';
import { DefaultController } from '../helper/custom-controller.decorator';

@DefaultController('/category', 'Category')
export class CategoryController {
  @ApiOperationPost(searchCategories)
  @Post('categories/search')
  async searchCategories(@Body() body: SearchCategoriesDto): Promise<SearchCategoriesResponseDto> {
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

    const categories = await Category.findAll({
      subQuery: false,
      include: [
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
      rows: categories.map((category) => {
        return {
          id: category.id,
          name: category.en,
        };
      }),
    };
  }
}
