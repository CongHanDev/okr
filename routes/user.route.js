"use strict";

const REQUEST = require("../enums/request-type.enum");
const basicRoute = require("../routes/basic.route");

const routes = {
	...basicRoute,

	create: {
		rest: `${ REQUEST.POST } /registration`,
	},

	list: {
		rest: `${ REQUEST.GET } `,
		// auth: "required",
		params: {
			limit: { type: "number", optional: true, convert: true },
			offset: { type: "number", optional: true, convert: true },
		},
	},

	get: {
		auth: "required",
		rest: `${ REQUEST.GET } /:id`,
	},

	verify: {
		rest: `${ REQUEST.PUT } /verify`,
		params: {
			id: {
				type: "string",
			},
			otp: {
				type: "string",
				pattern: /^[a-zA-Z0-9]+$/,
			},
		},
	},

	passwordChange: {
		rest: `${ REQUEST.POST } /change-password`,
		auth: "required",
		params: {
			old_password: { type: "string", min: 6 },
			new_password: { type: "string", min: 6 },
		},
	},
};

module.exports = routes;
