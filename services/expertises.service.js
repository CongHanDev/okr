"use strict";

const DbService = require("../mixins/db.mixin");
const routers = require("../routes/expertise.route");
const expertiseTransformer = require("../transformers/expertise.transformer");

module.exports = {
	name: "/expertises",
	mixins: [
		DbService("expertises"),
	],
	/**
   * Default settings
   */
	settings: {
		/** REST Basepath */
		rest: "/expertises",

		fields: [
			"_id",
			"name",
			"created_at",
			"updated_at",
			"deleted_at",
		],
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
			async handler (ctx) {
				return this.getEntityById(ctx, expertiseTransformer);
			},
		},

		/**
     * Update
     *
     */
		list: {
			...routers.list,
			async handler (ctx) {
				return this.loadList(ctx, expertiseTransformer);
			},
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
	methods: {},
};
