import { map, find, pick, omit, keys, isEmpty } from 'lodash';
import { literal, Transaction } from 'sequelize';
import {
  AutoIncrement,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  TableOptions,
  UpdatedAt,
} from 'sequelize-typescript';

export class EmptyModel<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TModelAttributes extends {} = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TCreationAttributes extends {} = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {}

export class BaseModel<
  // eslint-disable-next-line @typescript-eslint/ban-types
  TModelAttributes extends {} = any,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TCreationAttributes extends {} = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @CreatedAt
  @Default(literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  created_at?: Date;

  @UpdatedAt
  @Default(literal('CURRENT_TIMESTAMP'))
  @Column(DataType.DATE)
  updated_at?: Date;
}

export function CustomTable<M extends Model = Model>(tableName: string, timestamps = true, op: TableOptions<M> = {}) {
  return Table({ timestamps, freezeTableName: true, underscored: true, ...op, tableName });
}

export async function BulkUpdate<T extends { id?: number } = { id: number }>(
  model: any,
  elements: T[] = [],
  fieldsOrTransaction?: string[] | Transaction,
  externalTransaction?: Transaction,
) {
  if (!elements?.length) {
    return;
  }
  const fields = Array.isArray(fieldsOrTransaction) ? fieldsOrTransaction : keys(omit(elements[0], 'id'));

  const transaction = fieldsOrTransaction instanceof Transaction ? fieldsOrTransaction : externalTransaction;

  await Promise.all(
    elements
      .filter((el) => el.id && !isEmpty(pick(el, fields)))
      .map((element) =>
        model.update(pick(element, fields), {
          where: { id: element.id },
          transaction,
        }),
      ),
  );
}

export async function BulkUpsert<T extends { id?: number } = { id: number }>(
  model: any,
  elements: T[] = [],
  relatedId: any = {},
  fieldsOrTransaction?: string[] | Transaction,
  externalTransaction?: Transaction,
) {
  const transaction = fieldsOrTransaction instanceof Transaction ? fieldsOrTransaction : externalTransaction;

  await BulkUpdate(model, elements, fieldsOrTransaction, transaction);

  const toInsert = elements.filter((el) => !el.id).map((el) => ({ ...el, ...relatedId }));

  await model.bulkCreate(toInsert, { transaction: transaction });
}
