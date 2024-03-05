import { format, subMonths } from 'date-fns';
import lodash from 'lodash';
import sequelize from '../db';
import { DEFAULT_RMT_PERIOD, SORT_DIR } from './constants';

const { isNil } = lodash;

export const generalWhereFilter = (filter) => {
  const numericFields = [
    { field: 'rtp', min: 'rtp_min', max: 'rtp_max' },
    { field: 'bet_sum', min: 'bet_sum_min', max: 'bet_sum_max' },
    { field: 'profit', min: 'profit_min', max: 'profit_max' },
    { field: 'bet_quantity', min: 'bet_quantity_min', max: 'bet_quantity_max' },
  ];

  const conditions = generalWhereFilterConditions(numericFields, filter);

  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')} AND ` : '';
};

export const generalWhereFilterConditions = (numericFields, filter) => {
  const conditions = [];
  for (const { field, min, max } of numericFields) {
    if (!isNil(filter[min])) {
      conditions.push(`${field} >= ${sequelize.escape(filter[min])}`);
    }

    if (!isNil(filter[max])) {
      conditions.push(`${field} <= ${sequelize.escape(filter[max])}`);
    }
  }

  if (filter.sport_ids?.length) {
    conditions.push(`s.id IN (${filter.sport_ids.map((id) => sequelize.escape(id))})`);
  }

  if (filter.active === 1 || filter.active === 0) {
    conditions.push(`active = ${sequelize.escape(filter.active)}`);
  } else if (filter.active === null) {
    conditions.push(`(active IS NULL OR active = 1)`);
  }

  return conditions;
};

export const generateDateFilter = (filter) => {
  let res = '';
  if (filter.date_from && filter.date_to) {
    res += `bo.created_at >= '${format(new Date(filter.date_from), 'yyyy-MM-dd HH:mm:ss')}' AND `;
    res += `bo.created_at <= '${format(new Date(filter.date_to), 'yyyy-MM-dd HH:mm:ss')}' AND `;
  } else if (filter.date_from && !filter.date_to) {
    res += `bo.created_at >= '${format(new Date(filter.date_from), 'yyyy-MM-dd HH:mm:ss')}' AND `;
  } else {
    res += `bo.created_at >= '${format(subMonths(new Date(), DEFAULT_RMT_PERIOD), 'yyyy-MM-dd HH:mm:ss')}' AND `;
  }

  return res ? res.slice(0, -4) : '';
};

export const generalListOptions = (body) => {
  const perPage = body.per_page;
  const page = !body.page || body.page < 1 ? 1 : body.page;

  return {
    perPage,
    page,
    offset: (page - 1) * perPage,
    sortBy: body.sort_by || 'profit',
    sortDir: body.sort_dir || SORT_DIR.DESC,
  };
};
