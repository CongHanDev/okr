"use strict";

const routers = require("../routes/unit.route");
const schema = require("../schemas/unit.schema");

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
					_id: `e7f6843b-45e1-46ae-aaea-d380162e08e6-${i}`,
					name: "Unit " + i,
					slug: "UNIT_" + i,
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
