"use strict";
const routers = require("../routes/user_type.route");
const schema = require("../schemas/user_type.schema");

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
};
