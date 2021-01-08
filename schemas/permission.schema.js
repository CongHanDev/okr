"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "permission",
	mixins: [DbService("permissions"), CacheCleanerMixin(["cache.clean.permission"])],
	settings: {
		fields: [
			"_id",
			"name",
			"slug",
			"model",
			"description",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		entityValidator: {
			name: { type: "string" },
			slug: { type: "string" },
			model: { type: "string" },
			description: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
