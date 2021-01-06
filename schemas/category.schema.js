"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "categories",
	mixins: [DbService("categories"), CacheCleanerMixin(["cache.clean.categories"])],
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

		/** Validator schema for entity */
		entityValidator: {
			slug: { type: "string" },
			name: { type: "string" },
			description: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	}
};

module.exports = schemas;
