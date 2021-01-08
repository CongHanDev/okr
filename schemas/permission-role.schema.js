"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "permission-role",
	mixins: [DbService("permission_roles"), CacheCleanerMixin(["cache.clean.permission-role"])],
	settings: {
		fields: [
			"_id",
			"slug",
			"permission",
			"role",
			"description",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		entityValidator: {
			slug: { type: "string" },
			permission: { type: "string" },
			role: { type: "string" },
			description: { type: "string", optional: true },
		},
		populates: {
			permission: {
				action: "permission.get",
			},
			role: {
				action: "role.get",
			},
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
