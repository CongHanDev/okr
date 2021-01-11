"use strict";

const routers = require("../routes/work-formality.route");
const schema = require("../schemas/work-formality.schema");

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
	methods: {
		// async seedDB () {
		// 	let data = [];
		// 	for (let i = 1; i <= 10; i++) {
		// 		data.push(
		// 			{
		// 				_id: `25b2af5b-588c-4583-b906-2bc328dbd09d-${ i }`,
		// 				name: "Work formality " + i,
		// 				description: "",
		// 				created_at: new Date(),
		// 			});
		// 	}
		// 	await this.adapter.insertMany(data);
		// },
	},
};
