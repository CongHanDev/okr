"use strict";

const routers = require("../routes/service-form.route");
const schema = require("../schemas/service-form.schema");
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
		async seedDB () {
			let data = [];
			for (let i = 1; i <= 4; i++) {
				data.push(
					{
						_id: uuid.v4(),
						service_type: "259710ed-e770-4af8-89f5-6882ed222d4c-1",
						service: `cf57da99-6c69-4e48-ad88-ae2115d3b86b-${ i }`,
						content: "seeder",
						work_formality: `25b2af5b-588c-4583-b906-2bc328dbd09d-${ i }`,
						price: 0,
						unit: `e7f6843b-45e1-46ae-aaea-d380162e08e6-${ i }`,
						status: "8fefe177-a58a-40a8-849f-746aa9ba77a3",
						user: "c6cdce48-0574-45f6-ad13-05f24d1b7471-1",
						created_at: new Date(),
					});
			}
			await this.adapter.insertMany(data);
		},
	},
};
