import { AutoIncrement, Column, DataType, Default, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { HasManyGetAssociationsMixin } from 'sequelize';
import Error from './Error';
import ProviderData from './ProviderData';
import ProviderInfo from './ProviderInfo';
import ProviderOdds from './ProviderOdds';
import ProviderOption from './ProviderOption';

@Table({ timestamps: false, tableName: 'bb_provider', freezeTableName: true, underscored: true })
export default class Provider extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Column({ type: new DataType.STRING(32), unique: 'name_UNIQUE' })
  name: string;

  @Default(0)
  @Column({ type: DataType.SMALLINT, allowNull: false })
  enabled: number;

  @HasMany(() => Error, { sourceKey: 'id', foreignKey: 'provider_id', as: 'errors' })
  getErrors: HasManyGetAssociationsMixin<Error>;
  @HasMany(() => ProviderData, { sourceKey: 'id', foreignKey: 'provider_id', as: 'providerDatas' })
  getProviderDatas: HasManyGetAssociationsMixin<ProviderData>;
  @HasMany(() => ProviderInfo, { sourceKey: 'id', foreignKey: 'provider_id', as: 'providerInfos' })
  getProviderInfos: HasManyGetAssociationsMixin<ProviderInfo>;
  @HasMany(() => ProviderOdds, { sourceKey: 'id', foreignKey: 'provider_id', as: 'providerOdds' })
  getProviderOdds: HasManyGetAssociationsMixin<ProviderOdds>;
  @HasMany(() => ProviderOption, { sourceKey: 'id', foreignKey: 'provider_id', as: 'providerOptions' })
  getProviderOptions: HasManyGetAssociationsMixin<ProviderOption>;
}
