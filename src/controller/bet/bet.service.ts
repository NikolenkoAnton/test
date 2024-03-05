import lodash from 'lodash';
import { FindOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { Service } from 'typedi';
import { Bet, BetOutcome } from '../../db/models';
import { BET_HISTORY_TABLE_COLUMNS_ENUM } from '../../helper/constants';
import { ATTRIBUTES_TO_MODEL_MAP } from './constant';
const { pick, forEach, head, tail, flatten } = lodash;

@Service()
export class BetService {
  chooseColumns(options: FindOptions, columns: BET_HISTORY_TABLE_COLUMNS_ENUM[]) {
    const setAttributes = (model: typeof Model, attributes: string[]) => {
      function deepFindCallback(obj) {
        if (Array.isArray(obj)) {
          for (const item of obj) {
            deepFindCallback(item);
          }
        }

        if (obj.model === model) {
          obj.attributes = [...(obj.attributes || []), ...attributes];
          obj.attributes = flatten(obj.attributes) as any;

          return;
        }

        if (obj.include?.length) deepFindCallback(obj.include);
      }

      if (model === Bet) {
        options.attributes = [...((options.attributes || []) as any), ...attributes];

        options.attributes = flatten(options.attributes) as any;
        return;
      }

      deepFindCallback(options.include);

      return setAttributes;
    };

    forEach(columns, (column) => {
      const columnValue = ATTRIBUTES_TO_MODEL_MAP.get(column);

      if (columnValue) {
        setAttributes(head(columnValue) as any, tail(columnValue) as any);
      }
    });

    setAttributes(BetOutcome, ['pool', 'profit']);

    return options;
  }
}
