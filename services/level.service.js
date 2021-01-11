"use strict";

const routers = require("../routes/level.route");
const schema = require("../schemas/level.schema");
const uuid = require("uuid");

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
		async seedDB() {
			let data = [];
			for (let i = 1; i <= 5; i++) {
				data.push({
					_id: `7d1ae12d-74cc-4ff7-9651-5296c29c7f43-${i}`,
					name: "Level " + i,
					description: "",
					created_at: new Date(),
				});
			}
			await this.adapter.insertMany(data);
		},
	},
};
