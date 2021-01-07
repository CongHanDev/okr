"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "levels",
	mixins: [DbService("levels"), CacheCleanerMixin(["cache.clean.levels"])],
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
			description: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	}
};

module.exports = schemas;
