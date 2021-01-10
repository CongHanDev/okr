"use strict";

const routers = require("../routes/expertise.route");
const schema = require("../schemas/expertise.schema");

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
			for (let i = 1; i <= 10; i++) {
				data.push({
					_id: `ccce1f35-cc78-404c-80f8-3d682f293abe-${i}`,
					name: "Expertise " + i,
					description: "",
					created_at: new Date(),
				});
			}
			await this.adapter.insertMany(data);
		},
	},
};
