"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "service",
	mixins: [DbService("services"), CacheCleanerMixin(["cache.clean.service"])],
	settings: {
		fields: [
			"_id",
			"name",
			"slug",
			"service_type",
			"description",
			"image",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		populates: {
			service_type: {
				action: "service-type.get",
			},
		},
		entityValidator: {
			name: { type: "string" },
			slug: { type: "string" },
			service_type: { type: "string" },
			description: { type: "string", optional: true },
			image: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
