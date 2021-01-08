"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "service-price",
	mixins: [DbService("service_prices"), CacheCleanerMixin(["cache.clean.service-price"])],
	settings: {
		fields: [
			"_id",
			"name",
			"service_price_type",
			"service_type",
			"service",
			"price",
			"unit",
			"escrow_requester",
			"escrow_supplier",
			"apply_date",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		populates: {
			service_price_type: {
				action: "service-price-type.get",
			},
			service_type: {
				action: "service-type.get",
			},
			service: {
				action: "service.get",
			},
			unit: {
				action: "unit.get",
			},
		},
		entityValidator: {
			name: { type: "string" },
			service_price_type: { type: "string" },
			service_type: { type: "string" },
			service: { type: "string" },
			price: { type: "number", default: 0 },
			unit: { type: "string" },
			escrow_requester: { type: "number" },
			escrow_supplier: { type: "number" },
			apply_date: { type: "date", optional: true },
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
