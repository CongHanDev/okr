"use strict";
const routers = require("../routes/user-type.route");
const schema = require("../schemas/user-type.schema");
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
					_id: `83ece746-bdb2-42c7-8df8-0eb5325a08af-${i}`,
					slug: `TYPE_${i}`,
					name: "User type " + i,
					description: "",
					created_at: new Date(),
				});
			}
			await this.adapter.insertMany(data);
		},
		async afterConnected() {
			this.adapter.collection.createIndex(schema.settings.indexes);
		},
	},
};
