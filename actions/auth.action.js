"use strict";

const { translate } = require("../languages/index.language");
const routers = require("../routes/auth.route");
const responder = require("../mixins/response.mixin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const uuid = require("uuid");
const _ = require("lodash");
const emailProvider = require("../commons/emails/emailProvider");
const cryptoRandomString = require("crypto-random-string");
/**
 * Actions
 *
 */
const actions = {
	/**
   * Actions
   *
   */
	login: {
		...routers.login,
		params: {
			user_name: { type: "string", min: 6 },
			password: { type: "string", min: 6 },
		},
		async handler (ctx) {
			const { user_name, password } = ctx.params;
			const users = await ctx.call("user.find",
				{ populate: ["status"], query: { $or: [{ email: user_name }, { phone: user_name }] } });
			const user = _.first(users);
			if (!user) {
				return responder.httpBadRequest(translate("unauthorized"), { user_name: translate("user_name_invalid") });
			}
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
   * Login social
   *
   */
	social: {
		...routers.social,
		async handler (ctx) {
			const { access_token, social } = ctx.params;
			let userSocial = null;
			if (social === "facebook") {
				userSocial = await facebook(access_token);
			} else {
				userSocial = await google(access_token);
			}
			if (!userSocial) {
				return responder.httpBadRequest(translate("unauthorized"),
					{ user_name: "Can't login by your google account." });
			}
			const dbUsers = await ctx.call("user.find", { query: { email: userSocial.email } });
			let currentUser = _.first(dbUsers);
			if (!currentUser) {
				/* Status */
				const status = await ctx.call("status.find", {
					query: { slug: "ACTIVATED", type: "USER" },
				});

				const newUser = {
					...userSocial,
					_id: uuid.v4(),
					status: _.first(status)._id,
					access_token: access_token,
				};

				currentUser = await ctx.call("user.create", newUser);
			}
			return generateToken(currentUser);
		},
	},

	/**
   * Forgot password
   *
   * @actions
   *
   * @returns {String} User entity
   */
	forgotPassword: {
		...routers.passwordForgot,
		async handler (ctx) {
			const { email } = ctx.params;
			const users = await ctx.call("user.find", { query: { email: email } });
			const user = _.first(users);
			if (!user) {
				return responder.httpNotFound();
			}
			/* Send OTP */
			const otp = cryptoRandomString({ length: 6, type: "numeric" }).toUpperCase();
			user.otp = otp;
			let isSend = await emailProvider.passwordVerify(user);
			if (isSend) {
				await ctx.call("user.update", { id: user._id, otp: otp });
				return responder.httpOK([]);
			}
			return responder.httpError("Error");
		},
	},

	/**
   * Verify forgot password
   *
   */
	verifyForgotPassword: {
		...routers.verifyPassword,
		async handler (ctx) {
			const { email, otp, password } = ctx.params;
			const users = await ctx.call("user.find", { query: { email: email } });
			const user = _.first(users);
			if (!user) {
				return responder.httpNotFound();
			}
			if (user.otp !== otp) {
				return responder.httpBadRequest(translate("password_reset"), { otp: translate("otp_valid") });
			}
			await ctx.call("user.update", { id: user._id, otp: "", password: bcrypt.hashSync(password, 10) });
			return responder.httpOK([]);
		},
	},

	/**
   * Get current user entity.
   * Auth is required!
   *
   * @actions
   *
   * @returns {String} User entity
   */
	verifyAccount: {
		...routers.verifyAccount,
		async handler (ctx) {
			let request = ctx.params;
			let errors = {};
			const entity = await ctx.call("user.get", { id: request.id });
			if (!entity) {
				return responder.httpNotFound();
			}
			/* Validate otp */
			if (!_.has(request, "otp")) {
				errors.otp = translate("otp_required");
			}
			if (entity.otp !== request.otp) {
				errors.otp = translate("otp_valid");
			}
			if (_.keys(errors).length) {
				return responder.httpBadRequest(
					translate("validate"),
					errors,
				);
			}
			/* Status */
			const status = await ctx.call("status.find", {
				query: { slug: "ACTIVATED", type: "USER" },
			});
			const update = {
				id: entity._id,
				status: _.first(status)._id,
				otp: "",
				updated_at: new Date(),
			};
			/* Update database */
			const doc = await ctx.call("user.update", update);
			return doc;
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
		async handler (ctx) {
			const user = await ctx.call("user.get", {
				id: ctx.meta.auth.id,
				populate: [
					"avatar",
					"banner",
					"user_type",
					"city",
					"expertises",
					"level",
					"attaches",
					"services",
					"status",
					"role",
				],
			});
			if (!user) {
				return responder.httpBadRequest(translate("unauthorized"), { user_name: translate("user_name_invalid") },
				);

			}
			const pop = ["service_type", "service", "unit", "status", "role"];
			const service_forms = await ctx.call("service-form.find",
				{ populate: pop, query: { user: ctx.meta.auth.id } });
			user.service_forms = service_forms;
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
/*
*/
const google = async function (access_token) {
	const url = "https://oauth2.googleapis.com/tokeninfo?id_token";
	try {
		const response = await axios.get(url, {
			params: {
				id_token: access_token,
			},
		});
		const responseData = response.data;
		if (responseData) {
			const user = {
				email: responseData.email,
				first_name: responseData.given_name,
				last_name: responseData.family_name,
			};
			return user;
		}
	} catch (error) {
		return null;
	}
};

const facebook = async function (access_token) {
	try {
		return null;
	} catch (error) {
		return null;
	}
};

module.exports = actions;
