"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "expertises",
	mixins: [DbService("expertises"), CacheCleanerMixin(["cache.clean.expertises"])],
	settings: {
		fields: [
			"_id",
			"name",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		indexes: { "$**": "text" },
	}
};

module.exports = schemas;
