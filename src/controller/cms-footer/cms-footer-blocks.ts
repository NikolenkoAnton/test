import lodash from 'lodash';
import { Body, Get, NotFoundError, Patch, Post, Req } from 'routing-controllers';
import { ApiOperationGet, ApiOperationPatch, ApiOperationPost } from 'swagger-express-ts';
import { Inject } from 'typedi';
import sequelize from '../../db';
import {
  CmsFooterBlock,
  CmsFooterBlockType,
  CmsFooterGroup,
  CmsFooterGroupElement,
  CmsFooterGroupElementValue,
  CmsFooterGroupValue,
  SiteDomain,
  TranslateLanguage,
  UserLog,
} from '../../db/models';
import { BodyWithBlockId, SuccessStatusResponse } from '../../dto';
import {
  BodyWithElementId,
  BodyWithGroupId,
  CreateCmsFooterBlockRequest,
  CreateCmsFooterGroupElementRequest,
  CreateCmsFooterGroupRequest,
  UpdateCmsFooterRowBlockRequest,
} from '../../dto/cms-footer.requests';
import { CmsFooterBlockTypeResponse } from './../../dto/response/cms-footer';

import { Request } from 'express';
import {
  deleteCmsFooterBlock,
  deleteCmsFooterElement,
  deleteCmsFooterGroup,
  getCmsFooterBlock,
  getCmsFooterBlockTypes,
  saveCmsFooterBlock,
  saveCmsFooterElement,
  saveCmsFooterGroup,
  updateCmsFooterBlocks,
} from '../../../swagger/operations/cms-footer-group';
import { MAX_CMS_FOOTER_GROUP_COUNT, USER_LOG_ACTIONS } from '../../helper/constants';
import { DefaultController } from '../../helper/custom-controller.decorator';
import { BadRequestError, ServerError } from '../../helper/errors';
import { log } from '../../helper/sentry';
import { CmsFooterService } from '../../service/cms-footer-block.service';
import { CmsService } from '../../service/cms.service';
const { map } = lodash;

@DefaultController('/cms-footer', 'CMS Footer ')
export class CmsFooterBlockController {
  @Inject()
  private readonly cmsService: CmsService;

  @Inject()
  private readonly cmsFooterBlockService: CmsFooterService;

  @ApiOperationGet(getCmsFooterBlockTypes)
  @Get('blocks/types')
  async getCmsFooterBlockTypes(): Promise<CmsFooterBlockTypeResponse[]> {
    const blockTypes = await CmsFooterBlockType.findAll();

    return blockTypes;
  }

  @ApiOperationPost(getCmsFooterBlock)
  @Post('blocks')
  async getCmsFooterBlocks(@Body() data: { cms_footer_block_id?: number }) {
    if (data?.cms_footer_block_id) {
      return this.cmsFooterBlockService.getCmsFooterBlockById(data.cms_footer_block_id);
    }

    return this.cmsFooterBlockService.getCmsFooterBlockList();
  }

  @ApiOperationPatch(updateCmsFooterBlocks)
  @Patch('blocks/update')
  async updateCmsFooterBlocks(
    @Req() req: Request,
    @Body({ validate: true, required: true }) payload: UpdateCmsFooterRowBlockRequest,
  ) {
    try {
      await sequelize.transaction(async (transaction) => {
        await Promise.all(
          map(payload.rows, (block) => this.cmsFooterBlockService.updateCmsFooterBlock(block, transaction)),
        );

        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_BLOCK_UPDATE, req, transaction);
      });
    } catch (err) {
      log(err);
      throw new ServerError();
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(saveCmsFooterBlock)
  @Post('blocks/save')
  async createCmsFooterBlock(@Req() req: Request, @Body() data: CreateCmsFooterBlockRequest) {
    const type = await CmsFooterBlockType.findByPk(data.cms_footer_block_type_id);

    if (!type) {
      throw new NotFoundError('Type not found!');
    }
    try {
      await sequelize.transaction(async (transaction) => {
        await CmsFooterBlock.create({ ...data }, { transaction });

        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_BLOCK_CREATE, req, transaction);
      });
    } catch (err) {
      log(err);
      throw new ServerError();
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(deleteCmsFooterBlock)
  @Post('blocks/delete')
  async deleteCmsFooterBlock(
    @Body() { cms_footer_block_id }: BodyWithBlockId,
    @Req() req: Request,
  ): Promise<SuccessStatusResponse> {
    const blockToDelete = await CmsFooterBlock.findByPk(cms_footer_block_id);

    if (!blockToDelete) {
      throw new NotFoundError('Block not found!');
    }

    try {
      await sequelize.transaction(async (transaction) => {
        await blockToDelete.destroy({ transaction });

        await this.cmsService.recalculateBlocksPositions(transaction);

        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_BLOCK_DELETE, req, transaction);
      });
    } catch (err) {
      log(err);
      throw new ServerError('Cms footer block delete failed');
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(saveCmsFooterGroup)
  @Post('groups/save')
  async createCmsFooterGroup(@Body() data: CreateCmsFooterGroupRequest, @Req() req: Request) {
    const block = await CmsFooterBlock.findByPk(data.cms_footer_block_id, {
      include: [{ model: CmsFooterBlockType }],
      raw: true,
      nest: true,
    });

    if (!block) {
      throw new NotFoundError('Block not found!');
    }

    if (block.type.name !== 'Static pages') {
      throw new BadRequestError(`You cannot add groups to block with type ${block.type.name}`);
    }

    const current_groups_count = await CmsFooterGroup.count({
      where: { cms_footer_block_id: data.cms_footer_block_id },
    });

    if (current_groups_count >= MAX_CMS_FOOTER_GROUP_COUNT) {
      throw new BadRequestError('Excited count of groups for one block!');
    }

    try {
      return sequelize.transaction(async (transaction) => {
        const createdGroup = await CmsFooterGroup.create(
          { active: data.active, values: data.values, cms_footer_block_id: data.cms_footer_block_id },
          {
            returning: true,
            transaction,
            include: [{ model: CmsFooterGroupValue, include: [{ model: SiteDomain }, { model: TranslateLanguage }] }],
          },
        );
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_GROUP_CREATE, req, transaction);

        return this.cmsFooterBlockService.getCmsFooterGroupById(createdGroup.id, transaction);
      });
    } catch (err) {
      log(err);

      throw new ServerError('Cms footer group create failed');
    }
  }

  @ApiOperationPost(deleteCmsFooterGroup)
  @Post('groups/delete')
  async deleteCmsFooterGroup(@Body() data: BodyWithGroupId, @Req() req: Request): Promise<SuccessStatusResponse> {
    try {
      await sequelize.transaction(async (transaction) => {
        const group = await CmsFooterGroup.findByPk(data.cms_footer_group_id);

        if (!group) {
          return;
        }

        await group.destroy({ transaction });

        await this.cmsService.recalculateGroupsPositions(group.cms_footer_block_id, transaction);

        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_GROUP_DELETE, req, transaction);
      });
    } catch (err) {
      log(err);
      throw new ServerError('Cms footer group delete failed');
    }

    return { message: 'OK' };
  }

  @ApiOperationPost(saveCmsFooterElement)
  @Post('elements/save')
  async createCmsFooterElement(@Body() data: CreateCmsFooterGroupElementRequest, @Req() req: Request) {
    try {
      return sequelize.transaction(async (transaction) => {
        const createdElement = await CmsFooterGroupElement.create(
          {
            active: data.active,
            values: data.values,
            cms_footer_group_id: data.cms_footer_group_id,
            target_blank: data.target_blank,
          },
          {
            returning: true,
            transaction,
            include: [
              { model: CmsFooterGroupElementValue, include: [{ model: SiteDomain }, { model: TranslateLanguage }] },
            ],
          },
        );
        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_ELEMENT_CREATE, req, transaction);

        return this.cmsFooterBlockService.getCmsFooterGroupElementById(createdElement.id, transaction);
      });
    } catch (err) {
      log(err);
      throw new ServerError('Cms footer group create failed');
    }
  }

  @ApiOperationPost(deleteCmsFooterElement)
  @Post('elements/delete')
  async deleteCmsFooterElement(@Body() data: BodyWithElementId, @Req() req: Request): Promise<SuccessStatusResponse> {
    try {
      await sequelize.transaction(async (transaction) => {
        const element = await CmsFooterGroupElement.findByPk(data.cms_footer_group_element_id);

        if (!element) {
          return;
        }

        await element.destroy({ transaction });

        await this.cmsService.recalculateElementsPositions(element.cms_footer_group_id, transaction);

        await UserLog.add(USER_LOG_ACTIONS.CMS_FOOTER_ELEMENT_DELETE, req, transaction);
      });
    } catch (err) {
      log(err);
      throw new ServerError('Cms footer group delete failed');
    }

    return { message: 'OK' };
  }
}
