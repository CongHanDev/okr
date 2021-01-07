"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "city",
	mixins: [DbService("city"), CacheCleanerMixin(["cache.clean.city"])],
	settings: {
		fields: [
			"_id",
			"name",
		],
		entityValidator: {
			name: { type: "string" },
		},
		indexes: { "$**": "text" },
	}
};

module.exports = schemas;
