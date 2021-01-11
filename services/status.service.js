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
				},
				{
					_id: "8fefe177-a58a-40a8-849f-746aa9ba77a3",
					name: "Temp",
					slug: "TEMP",
					type: "SERVICE",
					description: "",
					created_at: new Date(),
				},
				{
					_id: "ce8580df-f798-4f1e-8fb9-c668bd318b6f",
					name: "Requested",
					slug: "REQUESTED",
					type: "SERVICE",
					description: "",
					created_at: new Date(),
				},
				{
					_id: "6acd75a9-d157-4883-b170-865a7eac3113",
					name: "Updating",
					slug: "UPDATING",
					type: "SERVICE",
					description: "",
					created_at: new Date(),
				},
				{
					_id: "bede15b6-4b08-4c5c-9d4b-6330485bc9dc",
					name: "Done",
					slug: "DONE",
					type: "SERVICE",
					description: "",
					created_at: new Date(),
				},
				{
					_id: "a97caba8-a89e-49b0-9631-8a992434134d",
					name: "Cancel",
					slug: "CANCEL",
					type: "SERVICE",
					description: "",
					created_at: new Date(),
				},
			];
			await this.adapter.insertMany(data);
		},
	},
};
