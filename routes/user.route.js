const REQUEST = require("../enums/request-type.enum");

const routes = {
	create: {
		rest: `${ REQUEST.POST } user/registration`,
	},

	list: {
		rest: `${ REQUEST.GET } user`,
		auth: "required",
		params: {
			limit: { type: "number", optional: true, convert: true },
			offset: { type: "number", optional: true, convert: true },
		},
	},

	get: {
		auth: "required",
		rest: `${ REQUEST.GET } user/:id`,
	},

	update: {
		rest: `${ REQUEST.PUT } user/:id`,
	},

	remove: {
		rest: `${ REQUEST.DELETE } user/:id`,
	},

	verify: {
		rest: `${ REQUEST.PUT } user/:id/verify`,
		params: {
			otp: {
				type: "string",
				pattern: /^[a-zA-Z0-9]+$/,
			},
		},
	},

	passwordChange: {
		rest: `${ REQUEST.POST } user/change-password`,
		auth: "required",
		params: {
			old_password: { type: "string", min: 6 },
			new_password: { type: "string", min: 6 },
		},
	},
};

module.exports = routes;
