"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "user-role",
	mixins: [DbService("user_roles"), CacheCleanerMixin(["cache.clean.user-role"])],
	settings: {
		fields: [
			"_id",
			"user",
			"role",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		entityValidator: {
			user: { type: "string" },
			role: { type: "string" },
		},
		populates: {
			user: {
				action: "user.get",
			},
			role: {
				action: "role.get",
			},
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
