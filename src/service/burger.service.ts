import { pick, map } from 'lodash';
import { Inject, Service } from 'typedi';
import {
  BurgerBlock,
  BurgerBlockItem,
  BurgerBlockItemValue,
  BurgerBlockValue,
  SiteDomain,
  TranslateLanguage,
} from '../db/models';
import { BulkUpdate, BulkUpsert } from '../db/models/Base';
import { BurgerBlockUpdateRequest, UpdateBurgerItemRequest } from '../dto/burger';
import { SettingsService } from './settings.service';
import { BadRequestError } from '../helper/errors';

@Service()
export class BurgerService {
  @Inject()
  private settingsService: SettingsService;

  async getBurgerBlocks() {
    const blocks = await BurgerBlock.scope('sorted').findAll({
      include: [
        {
          model: BurgerBlockValue,
          include: [{ model: SiteDomain }, { model: TranslateLanguage }],
        },
        {
          model: BurgerBlockItem,
          include: [
            {
              model: BurgerBlockItemValue,
              include: [{ model: SiteDomain.scope('main') }, { model: TranslateLanguage.scope('main') }],
            },
          ],
        },
      ],
      order: [['items', 'position', 'ASC']],
    });

    const mappedBlocks = await Promise.all(
      blocks.map(async (block) => {
        const defaultValue = await this.settingsService.getDefaultValue<BurgerBlockValue>(
          { burger_block_id: block.id },
          BurgerBlockValue,
        );
        block.name = defaultValue?.name;

        await Promise.all(
          block.items.map(async (item) => {
            const defaultValue = await this.settingsService.getDefaultValue<BurgerBlockItemValue>(
              { burger_block_item_id: item.id },
              BurgerBlockItemValue,
            );
            item.name = defaultValue?.name;
          }),
        );

        return block;
      }),
    );

    return mappedBlocks;
  }

  async deleteBurgerItem(id: number) {
    const item = await BurgerBlockItem.findByPk(id);

    if (!item) {
      return;
    }

    await item.destroy();

    await this.recalculateBurgerBlockItemsPositions(item.burger_block_id);
  }

  async getBurgerBlockById(id: number) {
    return BurgerBlock.findByPk(id, {
      include: [
        { model: BurgerBlockValue },
        {
          model: BurgerBlockItem,
          include: [{ model: BurgerBlockItemValue, include: [{ model: SiteDomain }, { model: TranslateLanguage }] }],
        },
      ],
      order: [['items', 'position', 'ASC']],
    });
  }

  async patchMany(blocks: BurgerBlockUpdateRequest[]) {
    const updateBlock = async (block: BurgerBlockUpdateRequest) => {
      await BurgerBlock.update(pick(block, 'active', 'position'), { where: { id: block.id } });

      await BulkUpsert(BurgerBlockValue, block?.values, { burger_block_id: block.id });

      await Promise.all(map(block.items || [], updateItem));
    };

    const updateItem = async (item: UpdateBurgerItemRequest) => {
      await BurgerBlockItem.update(pick(item, 'active', 'position', 'name'), {
        where: { id: item.id },
      });

      await BulkUpsert(BurgerBlockItemValue, item?.values, { burger_block_item_id: item.id });
    };

    return Promise.all(map(blocks, updateBlock));
  }

  public async recalculateBurgerBlockItemsPositions(burger_block_id: number) {
    const items = await BurgerBlockItem.scope('sorted').findAll({
      where: { burger_block_id },
    });

    await Promise.all(
      items.map(async (element: BurgerBlockItem, index: number) => {
        element.position = index + 1;

        await element.save({ fields: ['position'] });
      }),
    );
  }

  public async createBurgerItemValidation(data: UpdateBurgerItemRequest) {
    const block = await this.getBurgerBlockById(data.burger_block_id);
    if (!block.can_has_items) {
      throw new BadRequestError('Block can not have items');
    }
  }
}
