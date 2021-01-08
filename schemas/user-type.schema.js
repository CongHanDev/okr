"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "user-type",
	mixins: [DbService("user_types"), CacheCleanerMixin(["cache.clean.user-type"])],
	settings: {
		fields: [
			"_id",
			"name",
			"slug",
			"description",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		entityValidator: {
			name: { type: "string" },
			slug: { type: "string" },
			description: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
