"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "service-form",
	mixins: [DbService("service_forms"), CacheCleanerMixin(["cache.clean.service-form"])],
	settings: {
		fields: [
			"_id",
			"service_type",
			"service",
			"content",
			"work_formality",
			"price",
			"unit",
			"status",
			"user",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		populates: {
			service_type: {
				action: "service-type.get",
			},
			service: {
				action: "service.get",
			},
			unit: {
				action: "unit.get",
			},
			status: {
				action: "status.get",
			},
			user: {
				action: "user.get",
			},
		},
		entityValidator: {
			service_type: { type: "string", optional: true },
			service: { type: "string", optional: true },
			content: { type: "string", optional: true },
			work_formality: { type: "string", optional: true },
			price: { type: "number", optional: true, default: 0 },
			unit: { type: "string", optional: true },
			status: { type: "string", optional: true },
			user: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
