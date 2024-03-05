import { AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import TranslateKeyValue from './TranslateKeyValue';
import { HasManyGetAssociationsMixin } from 'sequelize';

@Table({ timestamps: false, tableName: 'bb_translate_key', freezeTableName: true, underscored: true })
export default class TranslateKey extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(256), allowNull: false })
  key: string;

  @Column({ type: new DataType.STRING(128) })
  group: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @HasMany(() => TranslateKeyValue, { sourceKey: 'id', foreignKey: 'translate_key_id', as: 'translateKeyValues' })
  getTranslateKeyValues: HasManyGetAssociationsMixin<TranslateKeyValue>;
}
