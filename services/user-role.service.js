"use strict";

const routers = require("../routes/user-role.route");
const schema = require("../schemas/user-role.schema");

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
					user: "c6cdce48-0574-45f6-ad13-05f24d1b7471-1",
					role: "b1f08c96-f1f6-4068-8fe8-733e1ce5b7fd",
					created_at: new Date(),
				},
				{
					_id: "c48e16e5-9781-4894-9253-d5c38913687a",
					user: "c6cdce48-0574-45f6-ad13-05f24d1b7471-2",
					role: "97cfd6cc-5fe6-4127-8374-0d268bf17ab3",
					created_at: new Date(),
				},
			];
			await this.adapter.insertMany(data);
		},

		async afterConnected () {
			this.adapter.collection.createIndex(schema.settings.indexes);
		},
	},
};
