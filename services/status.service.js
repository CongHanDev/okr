"use strict";

const routers = require("../routes/status.route");
const schema = require("../schemas/status.schema");

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
		async seedDB () {
			let data = [
				{
					_id: "f7950c61-accf-437e-a688-fc7d87d51276",
					name: "Not active",
					slug: "NOT_ACTIVATE",
					type: "USER",
					description: "",
					created_at: new Date(),
				},
				{
					_id: "c48e16e5-9781-4894-9253-d5c38913687a",
					name: "Block",
					slug: "BLOCK",
					type: "USER",
					description: "",
					created_at: new Date(),
				},
				{
					_id: "33a19fcf-a2c2-4beb-82f7-af9b46d18a3d",
					name: "Activated",
					slug: "ACTIVATED",
					type: "USER",
					description: "",
					created_at: new Date(),
				}];
			await this.adapter.insertMany(data);
		},
	},
};
