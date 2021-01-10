"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "user",
	mixins: [DbService("users"), CacheCleanerMixin(["cache.clean.user"])],
	settings: {
		fields: [
			"_id",
			"avatar",
			"banner",
			"email",
			"first_name",
			"last_name",
			"password",
			"phone",
			"city",
			"identity_card",
			"birthday",
			"address",
			"user_type",
			"title",
			"introduce",
			"website",
			"expertises",
			"level",
			"attaches",
			"status",
			"deposit",
			"otp",
		],

		/** Validator schema for entity */
		entityValidator: {
			avatar: { type: "string", optional: true },
			banner: { type: "string", optional: true },
			email: { type: "email" },
			first_name: { type: "string" },
			last_name: { type: "string" },
			phone: { type: "string", min: 8, pattern: /^[a-zA-Z0-9]+$/ },
			city: { type: "string", optional: true },
			identity_card: { type: "string", optional: true },
			birthday: { type: "string", optional: true },
			user_type: { type: "string", optional: true },
			address: { type: "string", optional: true },
			title: { type: "string", optional: true },
			introduce: { type: "string", optional: true },
			website: { type: "string", optional: true },
			expertises: { type: "array", items: "string", optional: true },
			level: { type: "string", optional: true },
			attaches: { type: "array", items: "string", optional: true },
			otp: { type: "string", optional: true },
			deposit: { type: "number", optional: true },
			services: { type: "array", items: "string", optional: true },
			status: { type: "string", optional: true },
		},
		populates: {
			avatar: {
				action: "file.get",
			},
			banner: {
				action: "file.get",
			},
			user_type: {
				action: "user-type.get",
			},
			city: {
				action: "city.get",
			},
			level: {
				action: "level.get",
			},
			expertises: {
				action: "expertise.get",
			},
			attaches: {
				action: "file.get",
			},
			status: {
				action: "status.get",
			},
		},
		indexes: { "$**": "text" },

		fieldsNotUpdate: [
			"email",
			"password",
			"phone",
			"otp",
		],
	},
};

module.exports = schemas;
