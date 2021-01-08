"use strict";

const { translate } = require("../languages/index.language");
const routers = require("../routes/auth.route");
const authTransformer = require("../transformers/auth.transformer");
const userTransformer = require("../transformers/user.transformer");
const responder = require("../mixins/response.mixin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Actions
 *
 */
const actions = {
	login: {
		...routers.login,
		params: {
			user_name: { type: "string", min: 6 },
			password: { type: "string", min: 6 },
		},
		async handler (ctx) {
			const { user_name, password } = ctx.params;
			const users = await ctx.call("users.find",
				{ populate: ["status"], query: { $or: [{ email: user_name }, { phone: user_name }] } });
			if (!users.length) {
				return responder.httpBadRequest(translate("unauthorized"), { user_name: translate("user_name_invalid") });
			}
			const user = { ...users[0] };
			const res = await bcrypt.compare(password, user.password);
			if (!res) {
				return responder.httpBadRequest(translate("unauthorized"), { password: translate("password_invalid") });
			}
			if (user.status.slug === "NOT_ACTIVATE") {
				return responder.httpBadRequest(translate("account_not_active"),
					{ user_name: translate("account_not_active") });
			}

			return generateToken(user);
		},
	},

	/**
	 * Get current user entity.
	 * Auth is required!
	 *
	 * @actions
	 *
	 * @returns {Object} User entity
	 */

	me: {
		...routers.me,
		cache: {
			keys: ["#userID"],
		},
		async handler (ctx) {
			const user = await ctx.call("users.get", { id: ctx.meta.auth.id, populate: ["avatar_id", "banner_id", "city_id", "expertise_ids", "level_id", "attach_ids", "service_ids", "status"] });
			if (!user) {
				return responder.httpBadRequest(translate("unauthorized"), { user_name: translate("user_name_invalid") });
			}
			return user;
		},
	},
	/**
	 * Get user by JWT token (for API GW authentication)
	 *
	 * @actions
	 * @param {String} token - JWT token
	 *
	 * @returns {Object} Resolved user
	 */
	resolveToken: {
		cache: {
			keys: ["token"],
			ttl: 60 * 60, // 1 hour
		},
		params: {
			token: "string",
		},
		async handler (ctx) {
			const decoded = await new this.Promise((resolve, reject) => {
				jwt.verify(
					ctx.params.token,
					process.env.JWT_SECRET,
					(err, decoded) => {
						if (err) return reject(err);

						resolve(decoded);
					},
				);
			});

			return decoded.id || null;
		},
	},
};

/**
 * Generate a JWT token from user entity
 *
 * @param {Object} user
 */
const generateToken = (user) => {
	const today = new Date();
	const exp = new Date(today);
	exp.setDate(today.getDate() + 60);

	const expiredTime = Math.floor(exp.getTime() / 1000);
	const token = jwt.sign(
		{
			id: user._id,
			phone: user.phone,
			exp: expiredTime,
		},
		process.env.JWT_SECRET,
	);

	return {
		token: token,
		exp: expiredTime,
	};
};

module.exports = actions;
