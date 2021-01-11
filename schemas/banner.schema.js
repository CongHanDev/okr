"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "banner",
	mixins: [DbService("banners"), CacheCleanerMixin(["cache.clean.banner"])],
	settings: {
		fields: [
			"_id",
			"name",
			"slug",
			"image",
			"start",
			"end",
			"description",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		entityValidator: {
			name: { type: "string" },
			description: { type: "string", optional: true },
		},
		populates: {
			image: {
				action: "file.get",
			},
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
