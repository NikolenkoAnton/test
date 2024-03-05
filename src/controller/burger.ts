import { Request } from 'express';
import { map, pick } from 'lodash';
import { Body, Delete, Get, Post, QueryParams, Req } from 'routing-controllers';
import { Inject } from 'typedi';

import { ApiOperationDelete, ApiOperationGet, ApiOperationPost } from 'swagger-express-ts';
import {
  deleteBurgerBlockItem,
  getBurgerBlocks,
  patchBurgerBlock,
  saveBurgerBlockItem,
} from '../../swagger/operations/burger';
import { BurgerBlockItem, BurgerBlockItemValue, SiteDomain, TranslateLanguage, UserLog } from '../db/models';
import {
  BodyWithId,
  BurgerBlockPatchManyRequest,
  QueryWithId,
  SuccessStatusResponse,
  UpdateBurgerItemRequest,
} from '../dto';
import { USER_LOG_ACTIONS } from '../helper/constants';
import { DefaultController } from '../helper/custom-controller.decorator';
import { BadRequestError, SaveError, ServerError } from '../helper/errors';
import { log } from '../helper/sentry';
import { BurgerService } from '../service/burger.service';

@DefaultController('/burger', 'Burger')
export class BurgerController {
  @Inject()
  private readonly burgerService: BurgerService;

  @ApiOperationGet(getBurgerBlocks)
  @Get('blocks')
  async getBurgerBlock(@QueryParams() data: BodyWithId) {
    if (data.id) {
      return this.burgerService.getBurgerBlockById(data.id);
    }

    const blocks = await this.burgerService.getBurgerBlocks();

    return { rows: blocks };
  }

  @ApiOperationPost(patchBurgerBlock)
  @Post('blocks/patchMany')
  async patchManyBurgerBlocks(@Body() body: BurgerBlockPatchManyRequest, @Req() req: Request) {
    try {
      await this.burgerService.patchMany(body.data);

      await UserLog.add(USER_LOG_ACTIONS.BURGER_BLOCK_UPDATE, req);
    } catch (err) {
      log(err);
      throw new SaveError();
    }

    return this.burgerService.getBurgerBlocks();
  }

  @ApiOperationDelete(deleteBurgerBlockItem)
  @Delete('items/delete')
  async deleteBurgerItem(@QueryParams() data: QueryWithId, @Req() req: Request): Promise<SuccessStatusResponse> {
    try {
      await this.burgerService.deleteBurgerItem(data.id);

      await UserLog.add(USER_LOG_ACTIONS.BURGER_BLOCK_ITEM_DELETE, req);
    } catch (err) {
      log(err);
      throw new ServerError('Burger item delete failed');
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(saveBurgerBlockItem)
  @Post('items/save')
  async updateBurgerItem(@Body() data: UpdateBurgerItemRequest, @Req() req: Request) {
    await this.burgerService.createBurgerItemValidation(data);

    try {
      if (!data.id) {
        const createdItem = await BurgerBlockItem.create(
          {
            target_blank: data.target_blank,
            active: data.active,
            values: data.values,
            burger_block_id: data.burger_block_id,
          },
          {
            returning: true,
            include: [{ model: BurgerBlockItemValue, include: [{ model: SiteDomain }, { model: TranslateLanguage }] }],
          },
        );
        await UserLog.add(USER_LOG_ACTIONS.BURGER_BLOCK_ITEM_UPDATE, req);

        return createdItem;
      }

      await BurgerBlockItem.update(pick(data, 'url', 'active', 'target_blank'), { where: { id: data.id } });

      await BurgerBlockItemValue.destroy({ where: { burger_block_item_id: data.id } });

      await Promise.all(
        map(data.values, ({ name, site_domain_id, language_id, url }) =>
          BurgerBlockItemValue.create({ burger_block_item_id: data.id, name, url, site_domain_id, language_id }),
        ),
      );
      await UserLog.add(USER_LOG_ACTIONS.BURGER_BLOCK_ITEM_UPDATE, req);

      return this.burgerService.getBurgerBlockById(data.burger_block_id);
    } catch (err) {
      log(err);
      throw new ServerError('Burger item update failed');
    }
  }
}
