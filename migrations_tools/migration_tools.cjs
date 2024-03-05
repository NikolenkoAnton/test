module.exports = {
	permissionsSeed: function (permissions) {
		function insertPermissions(permissions) {
			return async function (queryInterface) {
				const mappedPermissions = permissions.map((row) => ({ name: row.url, display_name: row.name, is_route: row.is_route ?? 1, path: row.path }))
				await queryInterface.bulkInsert('bb_permission', mappedPermissions);
			}
		};

		function deletePermissions(permissions) {
			return async function (queryInterface, Sequelize) {

				const permissionUrls = permissions.map((permission) => permission.url || permission.name || permission);
				await queryInterface.bulkDelete('bb_permission', {
					name: {
						[Sequelize.Op.in]: permissionUrls,
					},
				});
			}
		};
		return {
			up: insertPermissions(permissions),
			down: deletePermissions(permissions),
		}
	},

	wrapFunction: function (func) {
		return async function (queryInterface, Sequelize) {

			const transaction = await queryInterface.sequelize.transaction();
			try {
				await func({ trx: { transaction } }, queryInterface, Sequelize);

				await transaction.commit();
			}
			catch (err) {
				console.error(err);
				await transaction.rollback();
				throw err;
			}
		}
	},

	wrapMigration: function (object) {
		function wrap(func) {

			return async (queryInterface, Sequelize) => {
				const transaction = await queryInterface.sequelize.transaction();
				try {
					await func.call({ trx: { transaction } }, queryInterface, Sequelize);

					await transaction.commit();
				}
				catch (err) {
					console.error(err);
					await transaction.rollback();
					throw err;
				}
			}
		}

		return { up: wrap(object.up), down: wrap(object.down) }
	}
}