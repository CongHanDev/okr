const REQUEST = require("../enums/request-type.enum");

const routes = {
	create: {
		rest: `${REQUEST.POST} /users/registration`,
		params: {
			phone: {
				type: "string",
				min: 2,
				optional: true,
				pattern: /^[a-zA-Z0-9]+$/,
			},
			firstname: { type: "string", min: 2 },
			lastname: { type: "string", min: 2 },
			email: { type: "email" },
		},
	},

	getAll: {
		rest: `${REQUEST.GET} /users`,
		params: {
			limit: { type: "number", optional: true, convert: true },
			offset: { type: "number", optional: true, convert: true },
		},
	},

	find: {
		rest: `${REQUEST.GET} /users/:id`,
	},

	update: {
		rest: `${REQUEST.PUT} /users/:id`,
		params: {
			phone: {
				type: "string",
				min: 2,
				optional: true,
				pattern: /^[a-zA-Z0-9]+$/,
			},
			firstname: { type: "string", min: 2 },
			lastname: { type: "string", min: 2 },
			email: { type: "email" },
			bio: { type: "string", optional: true },
			image: { type: "string", optional: true },
			cityId: { type: "string", optional: true },
			passport: { type: "string", min: 8, optional: true },
			birthday: { type: "date", optional: true },
			personType: { type: "boolean", optional: true },
			title: { type: "string", optional: true },
			address: { type: "string", optional: true },
			introduce: { type: "string", optional: true },
			areasOfExpertiseId: { type: "string", optional: true },
			levelId: { type: "string", optional: true },
			attach: { type: "string", optional: true },
			services: { type: "array", items: "string", optional: true },
			status: { type: "number", optional: true },
			demons: { type: "number", optional: true },
		},
	},

	remove: {
		rest: `${REQUEST.DELETE} /users/:id`,
	},

	verify: {
		rest: `${REQUEST.PUT} /user/verify`,
		auth: "required",
	},

	social: {
		rest: `${REQUEST.POST} /users/social`,
		params: {
			user: {
				type: "object",
				props: {
					access_token: { type: "string", min: 6 },
					social: { type: "string", min: 2 },
				},
			},
		},
	},

	avatar: {
		rest: `${REQUEST.POST} /user/avatar`,
		auth: "required",
	},

	sentOTP: {
		rest: `${REQUEST.POST} /user/sentOTP`,
		params: {
			phone: { type: "string", min: 6 },
		},
	},

	follow: {
		rest: `${REQUEST.POST} /profiles/:phone/follow`,
		auth: "required",
		params: {
			phone: { type: "string" },
		},
	},

	unfollow: {
		rest: `${REQUEST.POST} /profiles/:phone/follow`,
		auth: "required",
		params: {
			username: { type: "string" },
		},
	},

	passwordChange: {
		rest: `${REQUEST.POST} /users/change-password`,
		params: {
			oldPassword: { type: "string", min: 6 },
			newPassword: { type: "string", min: 6 },
		},
	},

	passwordForgot: {
		rest: `${REQUEST.POST} /user/forgot-password`,
		params: {
			email: { type: "email" },
		},
	},

	passwordReset: {
		rest: `${REQUEST.POST} /user/reset-password`,
		auth: "required",
		params: {
			email: { type: "email" },
			newPassword: { type: "string" },
		},
	},
};

module.exports = routes;
