import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import TranslateLanguage from './TranslateLanguage';
import TranslateKey from './TranslateKey';
import { BelongsToGetAssociationMixin } from 'sequelize';
import SiteDomain from './SiteDomain';

@Table({ timestamps: false, tableName: 'bb_translate_key_value', freezeTableName: true })
export default class TranslateKeyValue extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => TranslateLanguage)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'bb_translate_language', key: 'id' } })
  language_id: number;

  @ForeignKey(() => SiteDomain)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'bb_site_domain', key: 'id' } })
  site_domain_id: number;

  @ForeignKey(() => TranslateKey)
  @Column({ type: DataType.INTEGER, allowNull: false, references: { model: 'bb_translate_key', key: 'id' } })
  translate_key_id: number;

  @Column({ type: new DataType.TEXT(), allowNull: false })
  value: string;

  @BelongsTo(() => TranslateLanguage, { targetKey: 'id', foreignKey: 'language_id', as: 'language' })
  getTranslateLanguage: BelongsToGetAssociationMixin<TranslateLanguage>;

  @BelongsTo(() => SiteDomain, { targetKey: 'id', foreignKey: 'site_domain_id', as: 'site_domain' })
  getSiteDomain: BelongsToGetAssociationMixin<SiteDomain>;

  @BelongsTo(() => TranslateKey, { targetKey: 'id', foreignKey: 'translate_key_id', as: 'translateKey' })
  getTranslateKey: BelongsToGetAssociationMixin<TranslateKey>;
}
