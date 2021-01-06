"use strict";

const routers = require("../routes/file.route");
const schema = require("../schemas/file.schema");

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
