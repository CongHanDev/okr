"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const routers = require("../routes/file.route");
const fileTransformer = require("../transformers/file.transformer");

module.exports = {
	name: "files",
	mixins: [
		DbService("files"),
		CacheCleanerMixin(["cache.clean.files"]),
	],
	/**
   * Default settings
   */
	settings: {
		fields: [
			"_id",
			"name",
			"upload_name",
			"mime_type",
			"size",
			"path",
			"model",
			"created_by",
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

		getById: {
			...routers.get,
			async handler (ctx) {
				return this.getEntityById(ctx, fileTransformer);
			},
		},

		/**
     * Update
     *
     */
		list: {
			...routers.list,
			async handler (ctx) {
				return this.loadList(ctx, fileTransformer);
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
