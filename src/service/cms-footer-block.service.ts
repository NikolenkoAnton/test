import { UpdateCmsFooterLogoRequest } from './../dto/cms-footer.requests';
import lodash from 'lodash';
import { Transaction } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { Service } from 'typedi';
import sequelize from '../db';
import {
  CmsFooterBlock,
  CmsFooterBlockType,
  CmsFooterGroup,
  CmsFooterGroupElement,
  CmsFooterGroupElementValue,
  CmsFooterGroupValue,
  CmsFooterLogo,
  CmsFooterLogoValue,
  SiteDomain,
  TranslateLanguage,
} from '../db/models';
import { BulkUpdate, BulkUpsert } from '../db/models/Base';
import {
  UpdateCmsFooterBlockRequest,
  UpdateCmsFooterGroupElementRequest,
  UpdateCmsFooterGroupRequest,
} from '../dto/cms-footer.requests';

const { pick, map } = lodash;

@Service()
export class CmsFooterService {
  async updateCmsFooterBlock(data: UpdateCmsFooterBlockRequest, externalTransaction?: Transaction) {
    return sequelize.transaction({ transaction: externalTransaction }, async (transaction) => {
      await CmsFooterBlock.update(pick(data, 'title', 'active', 'position', 'target_blank'), {
        where: { id: data.cms_footer_block_id },
        transaction,
      });

      const updateGroup = async (group: UpdateCmsFooterGroupRequest) => {
        await CmsFooterGroup.update(pick(group, 'active', 'position'), { where: { id: group.id }, transaction });

        await BulkUpdate(CmsFooterGroupValue, group?.values, ['title'], transaction);

        const groupValuesToInsert = group?.values
          .filter(({ id }) => !id)
          .map((data) => ({ ...data, cms_footer_group_id: group.id }));

        if (groupValuesToInsert?.length) {
          await CmsFooterGroupValue.bulkCreate(groupValuesToInsert, { transaction });
        }

        return await Promise.all(map(group.elements || [], updateElement));
      };

      const updateElement = async (element: UpdateCmsFooterGroupElementRequest) => {
        await CmsFooterGroupElement.update(pick(element, 'active', 'position', 'target_blank'), {
          where: { id: element.id },
          transaction,
        });

        await BulkUpdate(CmsFooterGroupElementValue, element?.values, ['title', 'url'], transaction);

        const elementValuesToInsert = element?.values
          .filter(({ id }) => !id)
          .map((data) => ({ ...data, cms_footer_group_element_id: element.id }));

        if (elementValuesToInsert?.length) {
          await CmsFooterGroupElementValue.bulkCreate(elementValuesToInsert, { transaction });
        }
      };

      const updateLogo = async (logo: UpdateCmsFooterLogoRequest) => {
        await CmsFooterLogo.update(pick(logo, 'active', 'position', 'title'), {
          where: { id: logo.id },
          transaction,
        });

        await BulkUpsert(CmsFooterLogoValue, logo?.values, { cms_footer_logo_id: logo.id }, ['url'], transaction);
      };

      await Promise.all(map(data.groups || [], updateGroup));
      await Promise.all(map(data.logos || [], updateLogo));
    });
  }

  async getCmsFooterBlockById(blockId: number): Promise<CmsFooterBlock> {
    return CmsFooterBlock.scope('sorted').findOne({
      where: {
        id: blockId,
      },
      include: [
        {
          model: CmsFooterGroup,
          include: [
            {
              model: CmsFooterGroupValue,
              include: [{ model: SiteDomain }, { model: TranslateLanguage, attributes: ['name', 'short'] }],
              attributes: ['id', 'cms_footer_group_id', 'language_id', 'site_domain_id', 'title'],
            },
            {
              model: CmsFooterGroupElement,
              include: [
                {
                  model: CmsFooterGroupElementValue,
                  include: [{ model: SiteDomain }, { model: TranslateLanguage, attributes: ['id', 'name', 'short'] }],
                },
              ],
            },
          ],
        },
      ],

      attributes: { exclude: ['created_at', 'updated_at'] },
      // attributes: ['cms_footer_block_id', 'position', 'active'],
      order: [
        ['groups', 'position', 'ASC'],
        ['groups', 'elements', 'position', 'ASC'],
      ],
    });
  }

  async getCmsFooterGroupById(groupId: number, transaction?: Transaction): Promise<CmsFooterGroup> {
    return CmsFooterGroup.findByPk(groupId, {
      transaction,
      include: [
        {
          model: CmsFooterGroupValue,
          include: [{ model: SiteDomain }, { model: TranslateLanguage, attributes: ['name', 'short'] }],
          attributes: ['id', 'cms_footer_group_id', 'language_id', 'site_domain_id', 'title'],
        },
        {
          model: CmsFooterGroupElement,
          include: [
            {
              model: CmsFooterGroupElementValue,
              include: [{ model: SiteDomain }, { model: TranslateLanguage, attributes: ['id', 'name', 'short'] }],
            },
          ],
        },
      ],
    });
  }

  async getCmsFooterGroupElementById(elementId: number, transaction?: Transaction): Promise<CmsFooterGroupElement> {
    return CmsFooterGroupElement.findByPk(elementId, {
      transaction,
      include: [
        {
          model: CmsFooterGroupElementValue,
          include: [{ model: SiteDomain }, { model: TranslateLanguage, attributes: ['id', 'name', 'short'] }],
        },
      ],
    });
  }

  async getCmsFooterBlockList() {
    return CmsFooterBlock.scope('sorted').findAll({
      attributes: ['id', 'title', 'position', 'active'],
      include: [{ model: CmsFooterBlockType }],
    });
  }
}
