import { eachDayOfInterval, format, getDate, getDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Op, QueryTypes, Transaction, literal } from 'sequelize';
import { Service } from 'typedi';
import { CalendarSchedule } from '../db/models';
import { CalendarSchedulePayload, EntityPayload } from '../interface/calendar-schedule.type';
import { ScheduleIntervalPayload } from './../interface/calendar-schedule.type';
import { head, map } from 'lodash';
import sequelize from '../db';

@Service()
export class CalendarScheduleService {
  async createScheduleIntervals(
    calendarPayload: CalendarSchedulePayload,
    entityPayload: EntityPayload,
    externalTransaction?: Transaction,
  ): Promise<ScheduleIntervalPayload[]> {
    const intervals = this.generateIntervals(calendarPayload);

    const mappedInterval = map(intervals, (interval) => ({ ...interval, ...entityPayload }));
    await CalendarSchedule.bulkCreate(mappedInterval, { transaction: externalTransaction });

    return intervals;
  }

  generateIntervals(calendarPayload: CalendarSchedulePayload) {
    const {
      schedule_start_date,
      schedule_finish_date,
      schedule_start_time,
      schedule_finish_time,
      schedule_type,
      time_zone,
    } = calendarPayload;

    const intervals = [];
    const schedule_days = map(calendarPayload.schedule_days, (day) => parseInt(day as any));
    const startDate = new Date(schedule_start_date);
    const endDate = new Date(schedule_finish_date);
    eachDayOfInterval({ start: startDate, end: endDate }).forEach((day) => {
      const dayOfWeek = getDay(day); // Возвращает 0 для воскресенья, 1 для понедельника и так далее
      let shouldIncludeDay = false;

      if (schedule_type === 'DAY') {
        shouldIncludeDay = true;
      } else if (schedule_type === 'WEEK') {
        // Переводим результат getDay() в ваш формат (1 - понедельник ... 7 - воскресенье)
        const adjustedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
        shouldIncludeDay = schedule_days.includes(adjustedDayOfWeek);
      } else if (schedule_type === 'MONTH') {
        const dayOfMonth = getDate(day);
        shouldIncludeDay = schedule_days.includes(dayOfMonth);
      }

      if (shouldIncludeDay) {
        const startTimeString = `${format(day, 'yyyy-MM-dd')}T${schedule_start_time}.000`;
        const endTimeString = `${format(day, 'yyyy-MM-dd')}T${schedule_finish_time}.000`;

        const startDateTimeUtc = zonedTimeToUtc(startTimeString, time_zone);
        const endDateTimeUtc = zonedTimeToUtc(endTimeString, time_zone);

        const intervalObject = { start_time: startDateTimeUtc.toISOString(), end_time: endDateTimeUtc.toISOString() };

        intervals.push(intervalObject);
      }
    });

    return intervals;
  }

  async findCalendarIntersection(calendarPayload: CalendarSchedulePayload, entityType: string): Promise<null | number> {
    const intervals = this.generateIntervals(calendarPayload);
    let query = `SELECT * FROM bb_calendar_schedule WHERE entity_type = '${entityType}'`;
    // Добавление условий OVERLAPS для каждого интервала
    const overlapConditions = intervals.map((interval) => {
      const startTime = interval.start_time;
      const endTime = interval.end_time;
      return `(start_time, end_time) OVERLAPS ('${startTime}', '${endTime}')`;
    });

    // Объединение всех условий с помощью OR
    if (overlapConditions.length) {
      query += ` AND (${overlapConditions.join(' OR ')})`;
    }

    const intersectionIntervals: CalendarSchedule[] = await sequelize.query(query, { type: QueryTypes.SELECT });

    return intersectionIntervals.length ? head(intersectionIntervals).entity_id : null;
  }

  async removeAllScheduleIntervals(entityPayload: EntityPayload, externalTransaction?: Transaction) {
    await CalendarSchedule.destroy({ where: { ...entityPayload }, transaction: externalTransaction });
  }

  async isActive(entityPayload: EntityPayload, externalTransaction?: Transaction): Promise<boolean> {
    const activeSchedule = await CalendarSchedule.findOne({
      where: {
        ...entityPayload,
        start_time: {
          [Op.lte]: literal(`CURRENT_TIMESTAMP AT TIME ZONE 'UTC'`),
        },
        end_time: {
          [Op.gte]: literal(`CURRENT_TIMESTAMP AT TIME ZONE 'UTC'`),
        },
      },
      transaction: externalTransaction,
    });

    return !!activeSchedule;
  }
}
