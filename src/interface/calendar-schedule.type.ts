export type CalendarSchedulePayload = {
  schedule_start_date: string | Date;
  schedule_finish_date: string | Date;
  schedule_start_time: string;
  schedule_finish_time: string;
  schedule_type: string;
  schedule_days: number[];
  time_zone: string;
};

export interface EntityPayload {
  entity_id: number;
  entity_type: string;
}

export interface ScheduleIntervalPayload extends EntityPayload {
  start_time: Date;
  end_time: Date;
}

export enum ScheduleTypeEnum {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}
