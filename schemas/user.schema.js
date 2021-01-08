"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "users",
	mixins: [DbService("users"), CacheCleanerMixin(["cache.clean.users"])],
	settings: {
		fields: [
			"_id",
			"avatar_id",
			"banner_id",
			"email",
			"first_name",
			"last_name",
			"password",
			"phone",
			"city_id",
			"identity_card",
			"birthday",
			"address",
			"user_type_id",
			"introduce",
			"website",
			"expertise_ids",
			"level_id",
			"attach_ids",
			"status",
			"deposit",
			"service_ids",
			"otp",
			"status",
		],

		/** Validator schema for entity */
		entityValidator: {
			avatar_id: { type: "string", optional: true },
			banner_id: { type: "string", optional: true },
			email: { type: "email" },
			first_name: { type: "string" },
			last_name: { type: "string" },
			phone: { type: "string", min: 8, pattern: /^[a-zA-Z0-9]+$/ },
			city_id: { type: "string", optional: true },
			identity_card: { type: "string", optional: true },
			birthday: { type: "date", optional: true },
			address: { type: "string", optional: true },
			introduce: { type: "string", optional: true },
			website: { type: "string", optional: true },
			expertise_ids: { type: "array", items: "string", optional: true },
			level_id: { type: "string", optional: true },
			attach_ids: { type: "array", items: "string", optional: true },
			otp: { type: "string", optional: true },
			deposit: { type: "number", optional: true },
			service_ids: { type: "array", items: "string", optional: true },
			status: { type: "string", optional: true },
		},
		populates: {
			avatar_id: {
				action: "files.get",
			},
			user_type: {
				action: "user-type.get",
			},
			city_id: {
				action: "cities.get",
			},
			level_id: {
				action: "levels.get",
			},
			expertise_ids: {
				action: "levels.get",
			},
			attaches_id: {
				action: "files.get",
			},
			services_id: {
				action: "services.get",
			},
			status: {
				action: "status.get",
			},
		},
		indexes: { "$**": "text" },
	},
};

module.exports = schemas;
