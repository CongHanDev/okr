"use strict";

const routers = require("../routes/banner.route");
const schema = require("../schemas/banner.schema");
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
			for (let i = 1; i <= 3; i++) {
				data.push({
					_id: uuid.v4(),
					name: "Banner " + i,
					image: `0de2b567-edb5-4f54-ba18-6d69653ed7ea-${i}`,
					description: "",
					created_at: new Date(),
				});
			}
			await this.adapter.insertMany(data);
		},
	},
};
