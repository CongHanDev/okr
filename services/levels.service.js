"use strict";

const routers = require("../routes/level.route");
const schema = require("../schemas/level.schema");

module.exports = {
	...schema,

	/**
	 * Actions
	 */
	actions: {
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
	methods: {},
};
