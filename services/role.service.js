"use strict";

const routers = require("../routes/role.route");
const schema = require("../schemas/role.schema");

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
    async afterConnected () {
      this.adapter.collection.createIndex(schema.settings.indexes);
    },

		async seedDB () {
			let data = [
				{
					_id: "b1f08c96-f1f6-4068-8fe8-733e1ce5b7fd",
					name: "Admin",
					slug: "ADMIN",
					created_at: new Date(),
				},
				{
					_id: "97cfd6cc-5fe6-4127-8374-0d268bf17ab3",
					name: "User",
					slug: "USER",
					created_at: new Date(),
				},
			];
			await this.adapter.insertMany(data);
		},
	},
};
