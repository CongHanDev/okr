"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "service-price-type",
	mixins: [DbService("service_price_types"), CacheCleanerMixin(["cache.clean.service-price-type"])],
	settings: {
		fields: [
			"_id",
			"name",
			"description",
			"status",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		populates: {
			status: {
				action: "status.get",
			},
		},
		entityValidator: {
			name: { type: "string" },
			description: { type: "string", optional: true },
			status: { type: "string", optional: true },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
