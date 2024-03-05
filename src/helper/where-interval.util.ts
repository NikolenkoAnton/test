import lodash from 'lodash';
import { Op, WhereOptions, literal } from 'sequelize';
import { DateIntervalPayload } from '../interface/common';
const { transform } = lodash;

export const buildWhereCondition = (param: { start?: number; end?: number }, property: string) => {
  const start = param?.start && new Date(param?.start);
  const end = param?.end && new Date(param?.end);

  if (start && end) {
    return {
      [property]: {
        [Op.and]: [{ [Op.gte]: start }, { [Op.lte]: end }],
      },
    };
  }

  if (start) {
    return {
      [property]: {
        [Op.gte]: start,
      },
    };
  }

  if (end) {
    return {
      [property]: {
        [Op.lte]: end,
      },
    };
  }

  return {};
};

export const buildWhereOrCondition = (params: DateIntervalPayload[], property: string) => {
  const getCondition = (param: { start_date?: Date; end_date?: Date }, property: string) => {
    // return [{ [Op.gte]: param.start_date }, { [Op.lte]: param.end_date }];
    return literal(`${property} BETWEEN '${param.start_date}' AND '${param.end_date}'`);
  };

  const allConditions = params.map((param) => getCondition(param, property));

  return allConditions;
};

export const whereWrap = (condition: WhereOptions): WhereOptions => {
  return transform(
    condition,
    (result, value, key) => {
      if (value) {
        result[key] = value;
      }
    },
    {},
  );
};
