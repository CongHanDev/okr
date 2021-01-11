"use strict";

const REQUEST = require("../enums/request-type.enum");

const routes = {
	login: {
		rest: `${ REQUEST.POST } /login`,
	},

	social: {
		rest: `${ REQUEST.POST } /login/social`,
		params: {
			access_token: { type: "string", min: 6 },
			social: { type: "string", min: 2 },
		},
	},

	me: {
		rest: "GET /me",
		auth: "required",
	},

	passwordForgot: {
		rest: `${ REQUEST.POST } /forgot-password`,
		params: {
			email: { type: "email" },
		},
	},

	verifyAccount: {
		rest: `${ REQUEST.PUT } /verify-account`,
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

	verifyPassword: {
		rest: `${ REQUEST.POST } /verify-password`,
		params: {
			email: { type: "email" },
			otp: { type: "string" },
			password: { type: "string" },
		},
	},
};

module.exports = routes;
