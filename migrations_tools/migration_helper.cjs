const { pick, get } = require('lodash');
module.exports = {
  MigrationHelper: class {
    constructor(tableName, queryInterface, transaction) {
      this.tableName = tableName;
      this.queryInterface = queryInterface;
      this.transaction = transaction;
    }

    setQueryInterface(queryInterface) {
      this.queryInterface = queryInterface;
      return this;
    }
    setTransaction(transaction) {
      this.transaction = transaction;
      return this;
    }

    async getDefaultSettings() {
      const [{ id: site_alias_id }] = await this.queryInterface.select(null, 'bb_site_alias', {
        order: [['id', 'ASC']],
        limit: 1,
        raw: true,
      });

      const [{ id: language_id }] = await this.queryInterface.select(null, 'bb_translate_language', {
        order: [['id', 'ASC']],
        limit: 1,
        where: { name: 'English' },
        raw: true,
      });

      return { site_alias_id, language_id };
    }

    setTableName(tableName) {
      this.tableName = tableName;
      return this;
    }

    async addColumns(columns) {
      await Promise.all(
        columns.map((column) =>
          this.queryInterface.addColumn(
            this.tableName,
            column.name,
            {
              ...pick(column, 'type', 'defaultValue', 'references', 'onUpdate', 'onDelete', 'values'),
              allowNull: get(column, 'allowNull', false),
            },
            {
              transaction: this.transaction,
            },
          ),
        ),
      );
    }

    async changeColumns(columns){
      await Promise.all(columns.map((column) =>
        this.queryInterface.changeColumn(
          this.tableName,
          column.name,
          {
            ...pick(column, 'type', 'defaultValue', 'references', 'onUpdate', 'onDelete', 'values'),
            allowNull: get(column, 'allowNull', false),
          },
          {
            transaction: this.transaction,
          },
        ),
      ))
    }

    async renameColumns(columns) {
      await Promise.all(columns.map((column) =>
        this.queryInterface.renameColumn(
          this.tableName,
          column.from,
          column.to,
          {
            transaction: this.transaction,
          },
        ),
      ))
    }

    async removeColumns(columnNames) {
      await Promise.all(
        columnNames.map((name) =>
          this.queryInterface.removeColumn(this.tableName, name, {
            transaction: this.transaction,
          }),
        ),
      );
    }
  },
};
