"use strict";

const REQUEST = require("../enums/request-type.enum");
const basicRoute = require("../routes/basic.route");

const routes = {
	...basicRoute,

	create: {
		rest: `${REQUEST.POST} /registration`,
	},

	list: {
		rest: `${REQUEST.GET} `,
		params: {
			limit: { type: "number", optional: true, convert: true },
			offset: { type: "number", optional: true, convert: true },
		},
	},

	get: {
		auth: "required",
		rest: `${REQUEST.GET} /:id`,
	},

	passwordChange: {
		rest: `${REQUEST.POST} /change-password`,
		auth: "required",
		params: {
			old_password: { type: "string", min: 6 },
			new_password: { type: "string", min: 6 },
		},
	},
};

module.exports = routes;
