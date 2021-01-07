"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "services",
	mixins: [DbService("services"), CacheCleanerMixin(["cache.clean.services"])],
	settings: {
		fields: [
			"_id",
			"slug",
			"name",
			"category_id",
			"description",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		populates: {
			category_id: {
				action: "categories.get",
			},
		},
		entityValidator: {
			slug: { type: "string" },
			name: { type: "string" },
			category: { type: "string" },
			description: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	}
};

module.exports = schemas;
