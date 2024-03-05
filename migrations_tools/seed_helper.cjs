module.exports = {
  SeedHelper: class {
    constructor(tableName) {
      this.tableName = tableName;
    }

    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     */
    setQueryInterface(queryInterface) {
      this.queryInterface = queryInterface;
      return this;
    }

    setTransaction(transaction) {
      this.transaction = transaction;
      return this;
    }

    async insert(rows) {
      await this.queryInterface.bulkInsert(this.tableName, rows, { transaction: this.transaction });
    }

    /**
     * @param {import('sequelize').WhereOptions} condition
     */
    async delete(condition) {
      await this.queryInterface.bulkDelete(this.tableName, condition, { transaction: this.transaction });
    }
  },
};
