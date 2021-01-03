"use strict";

const DbService = require("../mixins/db.mixin");
const routers = require("../routes/status.route");
const categoryTransformer = require("../transformers/category.transformer");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
	name: "category",
	mixins: [
		DbService("categories"),
		CacheCleanerMixin(["cache.clean.category"]),
	],
	/**
   * Default settings
   */
	settings: {
		fields: [
			"_id",
			"slug",
			"name",
			"description",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		entityValidator: {
			slug: { type: "string" },
			name: { type: "string" },
			description: { type: "string", optional: true },
		},
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
				return this.getEntityById(ctx, categoryTransformer);
			},
		},

		/**
     * Update
     *
     */
		list: {
			...routers.list,
			async handler (ctx) {
				return this.loadList(ctx, categoryTransformer);
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
