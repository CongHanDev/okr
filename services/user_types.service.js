"use strict";
const routers = require("../routes/user_type.route");
const responder = require("../mixins/response.mixin");
const userTypeTransformer = require("../transformers/user_type.transformer");
const DbService = require("../mixins/db.mixin");

module.exports = {
	name: "user-type",
	rest: "/user-type",
	mixins: [
		DbService("user_types"),
	],
	/**
   * Default settings
   */
	settings: {
		fields: ["_id", "key", "name"],
	},

	/**
   * Actions
   */
	actions: {
		/**
     * Update
     *
     */

		get: {
			...routers.get,
		},

		/**
     * Update
     *
     */
		list: {
			...routers.list,
			async handler (ctx) {
				const limit = ctx.params.limit ? Number(ctx.params.limit) : process.env.LIMIT;
				const offset = ctx.params.offset ? Number(ctx.params.offset) : 0;
				const name = ctx.params.name || null;

				let params = {
					limit,
					offset,
				};

				if (name) params.search = name;

				let countParams;

				countParams = Object.assign({}, params);
				// Remove pagination params
				if (countParams && countParams.limit) countParams.limit = null;
				if (countParams && countParams.offset) countParams.offset = null;

				const res = await this.Promise.all([
					// Get rows
					this.adapter.find(params),

					// Get count of all rows
					this.adapter.count(countParams),
				]);
				const page = offset ? offset : 1;
				params.total = res[1];
				params.currentpage = page;
				return responder.httpOK(res[0], userTypeTransformer, params);
			}
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
			await this.adapter.insertMany([
				{ id:"17a36ad0-ba3e-4127-865f-cc17e1bb7ba8",key: "PETITIONER", name: "Petitioner"},
				{ id:"9ce38388-ee49-47ea-af29-2c2612e696af",key: "IMPLEMENTING", name: "Implementing party"},
			]);
		}
	},
};
