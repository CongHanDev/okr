"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "status",
	mixins: [DbService("status"), CacheCleanerMixin(["cache.clean.status"])],
	settings: {
		fields: [
			"_id",
			"name",
			"slug",
			"type",
			"description",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		entityValidator: {
			name: { type: "string" },
			slug: { type: "string" },
			type: { type: "string" },
			description: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
