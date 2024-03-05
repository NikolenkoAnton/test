import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { ScheduleTypeEnum } from '../../interface/calendar-schedule.type';
import { COMBO_BONUS_STATUS_ENUM } from './constant';
import { ARRAY } from '../../../swagger/swagger-type';
@ApiModel({ name: 'ComboBonusValueSaveRequest' })
export class ComboBonusValueSaveRequest {
  @ApiModelProperty()
  id?: number;

  @ApiModelProperty()
  site_domain_id: number;

  @ApiModelProperty()
  language_id: number;

  @ApiModelProperty()
  name: string;
}

@ApiModel({ name: 'ComboBonusConditionRequest' })
export class ComboBonusConditionRequest {
  @ApiModelProperty()
  id?: number;

  @ApiModelProperty()
  from: number;

  @ApiModelProperty()
  bonus_odds: number;
}

@ApiModel({ name: 'ComboBonusSaveRequest' })
export class ComboBonusSaveRequest {
  @ApiModelProperty()
  id?: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  sport_id?: number;

  @ApiModelProperty()
  status: COMBO_BONUS_STATUS_ENUM;

  @ApiModelProperty({ type: ARRAY, model: 'ComboBonusValueSaveRequest' })
  values: ComboBonusValueSaveRequest[];

  @ApiModelProperty()
  min_odd?: number;

  @ApiModelProperty({ type: ARRAY, model: 'ComboBonusConditionRequest' })
  conditions: ComboBonusConditionRequest[];

  @ApiModelProperty()
  schedule_start_date: string;

  @ApiModelProperty()
  schedule_start_time: string;

  @ApiModelProperty()
  schedule_finish_date: string;

  @ApiModelProperty()
  schedule_finish_time: string;

  @ApiModelProperty()
  schedule_days: number[];

  @ApiModelProperty()
  schedule_type: ScheduleTypeEnum;

  @ApiModelProperty()
  time_zone: string;
}

/* 
Bonus ID - поиск по 3м символам. Этот ID формирует фронт энд в формате: CB1, CB2, CB3, CB4 и тд.

Bonus name - поиск по 3м символам. Название бонусва, которое ввел BO user для дефолтного языка

Sport - выпадающий список, возможен множественный выбор (как в РМТ)

Calendar - по дефолту All time (таких бонусов не должно быть много). Календарь, как в Betmonitor.

Status - множественный выбор. По дефолту - Publish, Actice, Draft, еще есть статусы Completed, Canceled */

// request with all decorators
@ApiModel({ name: 'GetComboBonusRequest' })
export class GetComboBonusRequest {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  sport_ids: number[];

  @ApiModelProperty()
  statuses: COMBO_BONUS_STATUS_ENUM[];
}

export class 
DeleteComboBonusRequest {
  id: number;
}
