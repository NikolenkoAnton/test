import { AutoIncrement, Column, DataType, Model, PrimaryKey } from 'sequelize-typescript';
import { CustomTable } from './Base';

@CustomTable('bb_entity_order', false)
export default class EntityOrder extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(64), allowNull: false, unique: 'entity_entity_id_unique' })
  entity: string;

  @Column({ type: DataType.INTEGER, allowNull: false, unique: 'entity_entity_id_unique' })
  entity_id: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  position: number;

  @Column({ type: DataType.SMALLINT, allowNull: false })
  favorite: number;

  @Column({
    type: DataType.BIGINT,
    references: { model: 'bb_translate_language', key: 'id' },
    unique: 'entity_entity_id_unique',
  })
  language_id: number;
}
