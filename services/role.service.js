"use strict";

const routers = require("../routes/role.route");
const schema = require("../schemas/role.schema");

module.exports = {
	...schema,

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Create
		 *
		 */
		create: {
			...routers.create,
		},

		/**
		 * Get
		 *
		 */

		get: {
			...routers.get,
		},

		/**
		 * List
		 *
		 */
		list: {
			...routers.list,
		},
		/**
		 * Update
		 *
		 */
		update: {
			...routers.update,
		},

		/**
		 * Remove
		 *
		 */
		remove: {
			...routers.remove,
		},
	},

	/**
	 * Methods
	 */
	methods: {
		async afterConnected() {
			this.adapter.collection.createIndex(schema.indexes);
		},
	},
};
