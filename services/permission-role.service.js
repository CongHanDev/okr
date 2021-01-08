"use strict";

const routers = require("../routes/permission-role.route");
const schema = require("../schemas/permission-role.schema");

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
