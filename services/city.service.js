"use strict";

const routers = require("../routes/city.route");
const schema = require("../schemas/city.schema");

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
			let data = [];
			for (let i = 1; i <= 100; i++) {
				data.push(
					{
						_id: `1d84fccc-bdfe-49ee-ae20-c3f13d503a70-${ i }`,
						name: "City " + i,
						description: "",
						created_at: new Date(),
					});
			}
			await this.adapter.insertMany(data);
		},
	},
};
