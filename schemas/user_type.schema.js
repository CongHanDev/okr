"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "user-types",
	mixins: [DbService("user_types"), CacheCleanerMixin(["cache.clean.user_types"])],
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
			type: { type: "string" },
			description: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
