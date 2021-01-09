"use strict";

const routers = require("../routes/service.route");
const schema = require("../schemas/service.schema");
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
		async seedDB () {
			let data = [];
			for (let i = 1; i <= 100; i++) {
				data.push(
					{
						_id: `cf57da99-6c69-4e48-ad88-ae2115d3b86b-${ i }`,
						name: "Service " + i,
						slug: `SERVICE_${ i }`,
						service_type: "259710ed-e770-4af8-89f5-6882ed222d4c-1",
						image: "0de2b567-edb5-4f54-ba18-6d69653ed7ea",
						description: "",
						created_at: new Date(),
					});
			}
			await this.adapter.insertMany(data);
		},
	},
};
