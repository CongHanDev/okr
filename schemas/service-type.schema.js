"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "service-type",
	mixins: [DbService("service_types"), CacheCleanerMixin(["cache.clean.service-type"])],
	settings: {
		fields: [
			"_id",
			"name",
			"slug",
			"description",
			"image",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		entityValidator: {
			name: { type: "string" },
			slug: { type: "string" },
			description: { type: "string", optional: true },
			image: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
