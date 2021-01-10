"use strict";

const routers = require("../routes/service-type.route");
const schema = require("../schemas/service-type.schema");
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
		// async seedDB () {
		// 	let data = [];
		// 	for (let i = 1; i <= 100; i++) {
		// 		data.push(
		// 			{
		// 				_id: `259710ed-e770-4af8-89f5-6882ed222d4c-${ i }`,
		// 				name: "Service type " + i,
		// 				slug: `SERVICE_TYPE_${ i }`,
		// 				image: "0de2b567-edb5-4f54-ba18-6d69653ed7ea",
		// 				description: "",
		// 				created_at: new Date(),
		// 			});
		// 	}
		// 	await this.adapter.insertMany(data);
		// },
	},
};
