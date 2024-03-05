import { omit } from 'lodash';
import { Inject, Service } from 'typedi';
import { CalendarScheduleService } from '../../service/calendar-schedule.service';
import { ComboBonusSaveRequest, DeleteComboBonusRequest, GetComboBonusRequest } from './combo-bonus.request';

import { Op, Transaction, WhereOptions, literal } from 'sequelize';
import sequelize from '../../db';
import { Sport, User } from '../../db/models';
import { BulkUpsert } from '../../db/models/Base';
import ComboBonus from '../../db/models/ComboBonus';
import ComboBonusCondition from '../../db/models/ComboBonusCondition';
import ComboBonusValue from '../../db/models/ComboBonusValue';
import SiteDomain from '../../db/models/SiteDomain';
import TranslateLanguage from '../../db/models/TranslateLanguage';
import { SettingsService } from '../../service/settings.service';
import { COMBO_BONUS_STATUS_ENUM } from './constant';
@Service()
export class ComboBonusService {
  @Inject()
  private calendarScheduleService: CalendarScheduleService;

  // inj SettingsService
  @Inject()
  private settingsService: SettingsService;

  async deleteComboBonus(data: DeleteComboBonusRequest) {
    const bonus = await ComboBonus.findByPk(data.id);

    if (bonus?.status === COMBO_BONUS_STATUS_ENUM.DRAFT) {
      throw new Error('Cannot delete published combo bonus');
    }

    await bonus.destroy();

    return true;
  }

  async getComboBonusById(id: number, externalTransaction?: Transaction) {
    const bonus = await ComboBonus.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Sport, attributes: ['id', 'name'] },
        {
          model: ComboBonusValue,
          include: [{ model: SiteDomain.scope('main') }, { model: TranslateLanguage.scope('main') }],
        },
        { model: ComboBonusCondition },
      ],
      transaction: externalTransaction,
    });

    const defaultValue = await this.settingsService.getDefaultValue<ComboBonusValue>(
      { combo_bonus_id: bonus.id },
      ComboBonusValue,
      externalTransaction,
    );

    bonus.name = defaultValue?.name;

    return bonus;
  }

  async getComboBonus(data: GetComboBonusRequest) {
    const where: WhereOptions = {};
    const andQuery = [];

    if (data.id) {
      andQuery.push([literal(`cast(id as text) like '%'||'${data.id}'||'%'`)]);
    }

    if (data.sport_ids) {
      where.sport_id = { [Op.in]: data.sport_ids };
    }
  }

  async saveComboBonus(data: ComboBonusSaveRequest, user_id: number) {
    return await sequelize.transaction(async (transaction) => {
      if (data.status === COMBO_BONUS_STATUS_ENUM.PUBLISHED) {
        const intersection = await this.calendarScheduleService.findCalendarIntersection(data, 'bb_combo_bonus');

        if (intersection) {
          throw new Error(`Calendar intersection with combo bonus ${intersection}`);
        }
      }

      const comboBonus = await ComboBonus.create(
        { ...data, creator_id: user_id },
        {
          returning: true,
          include: [
            { model: ComboBonusValue, include: [{ model: SiteDomain }, { model: TranslateLanguage }] },
            { model: ComboBonusCondition },
          ],
          transaction,
        },
      );

      if (data.status === COMBO_BONUS_STATUS_ENUM.PUBLISHED) {
        await this.calendarScheduleService.createScheduleIntervals(
          data,
          {
            entity_id: comboBonus.id,
            entity_type: 'bb_combo_bonus',
          },
          transaction,
        );
      }

      return this.getComboBonusById(comboBonus.id, transaction);
    });
  }

  async updateComboBonus(data: ComboBonusSaveRequest) {
    return await sequelize.transaction(async (transaction) => {
      const bonus = await ComboBonus.findByPk(data.id, {
        include: [
          { model: ComboBonusValue, include: [{ model: SiteDomain }, { model: TranslateLanguage }] },
          { model: ComboBonusCondition },
        ],
        transaction,
      });

      if ([COMBO_BONUS_STATUS_ENUM.COMPLETED, COMBO_BONUS_STATUS_ENUM.CANCELLED].includes(bonus.status)) {
        throw new Error(`Calendar cannot be modified`);
      }

      if (data.status === COMBO_BONUS_STATUS_ENUM.DRAFT && bonus.status !== COMBO_BONUS_STATUS_ENUM.DRAFT) {
        throw new Error(`Calendar cannot be update to draft`);
      }

      if (data.status === COMBO_BONUS_STATUS_ENUM.PUBLISHED && bonus.status === COMBO_BONUS_STATUS_ENUM.DRAFT) {
        const intersection = await this.calendarScheduleService.findCalendarIntersection(bonus, 'bb_combo_bonus');

        if (intersection) {
          throw new Error(`Calendar intersection with combo bonus ${intersection}`);
        } else {
          await this.calendarScheduleService.createScheduleIntervals(
            data,
            {
              entity_id: data.id,
              entity_type: 'bb_combo_bonus',
            },
            transaction,
          );
        }
      }

      const bonusPromise = bonus.update(omit(data, 'id', 'values', 'conditions'), { transaction });

      const bonusValuePromise = BulkUpsert(ComboBonusValue, data.values, { combo_bonus_id: data.id }, transaction);

      const bonusConditionsPromise = BulkUpsert(
        ComboBonusCondition,
        data.conditions,
        { combo_bonus_id: data.id },
        transaction,
      );

      await Promise.all([bonusPromise, bonusValuePromise, bonusConditionsPromise]);

      return this.getComboBonusById(data.id, transaction);
    });
  }
}
