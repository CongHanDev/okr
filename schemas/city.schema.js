"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "city",
	mixins: [DbService("cities"), CacheCleanerMixin(["cache.clean.city"])],
	settings: {
		fields: [
			"_id",
			"name",
			"description",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		entityValidator: {
			name: { type: "string" },
			description: { type: "string" },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
