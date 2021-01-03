"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
	name: "status",
	mixins: [
		DbService("status"),
		CacheCleanerMixin(["cache.clean.status"]),
	],
	/**
	 * Default settings
	 */
	settings: {
		fields: ["_id", "value", "name", "type", "description"],
		entityValidator: {
			value: { type: "number" },
			name: { type: "string" },
			type: { type: "string" },
			description: { type: "string", optional: true },
		},
	},

	/**
	 * Actions
	 */
	actions: {},

	/**
	 * Methods
	 */
	methods: {},
};
