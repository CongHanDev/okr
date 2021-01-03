"use strict";
const routers = require("../routes/user_type.route");
const userTypeTransformer = require("../transformers/user_type.transformer");
const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
	name: "user-type",
	rest: "/user-type",
	mixins: [
		DbService("user_types"),
		CacheCleanerMixin(["cache.clean.user_types"]),
	],
	/**
   * Default settings
   */
	settings: {
		fields: [
			"_id",
			"slug",
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
		},

		/**
     * Update
     *
     */
		list: {
			...routers.list,
			async handler (ctx) {
				return this.loadList(ctx, userTypeTransformer);
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
};
