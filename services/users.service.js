"use strict";

const { translate } = require("../languages/index.language");
const routers = require("../routes/user.route");
const bcrypt = require("bcryptjs");
const userTransformer = require("../transformers/user.transformer");
const responder = require("../mixins/response.mixin");
const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const email = require("../utils/emails/emailProvider");
const _ = require("lodash");
const uuid = require("uuid");
const cryptoRandomString = require("crypto-random-string");

module.exports = {
	name: "users",
	mixins: [
		DbService("users"),
		CacheCleanerMixin(["cache.clean.users", "cache.clean.follows"]),
	],

	/**
   * Default settings
   */
	settings: {
		/** REST Basepath */
		rest: "/user",

		/** Public fields */
		fields: [
			"_id",
			"password",
			"avatar",
			"banner",
			"email",
			"firs_tname",
			"last_name",
			"phone",
			"city",
			"identity_card",
			"birthday",
			"address",
			"user_type",
			"introduce",
			"website",
			"expertises",
			"level",
			"attaches",
			"status",
			"deposit",
			"services",
			"otp",
			"created_at",
			"updated_at",
			"deleted_at",
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
			birthday: { type: "date", optional: true },
			address: { type: "string", optional: true },
			user_type: { type: "string" },
			introduce: { type: "string", optional: true },
			website: { type: "string", optional: true },
			expertises: { type: "array", items: "string", optional: true },
			level: { type: "string", optional: true },
			attaches: { type: "array", items: "string", optional: true },
			status: { type: "string", optional: true },
			deposit: { type: "number", optional: true },
			services: { type: "array", items: "string", optional: true },
		},
		populates: {
			avatar: {
				action: "files.get",
			},
			banner: {
				action: "files.get",
			},
			user_type: {
				action: "user-type.get",
			},
		},
	},

	/**
   * Actions
   */
	actions: {
		/**
     * Register a new user
     *
     * @actions
     * @param {Object} user - User entity
     *
     * @returns {Object} Created entity & token
     */
		create: {
			...routers.create,
			async handler (ctx) {
				let request = ctx.params;
				const entity = await this.validateEntity(request);
				/* Set OTP */
				const otp = cryptoRandomString({ length: 10 }).toUpperCase();
				entity.otp = otp;
				/* Set ID */
				entity._id = uuid.v4();
				/* Created at */
				entity.created_at = new Date();
				/* Status */
				const status = await ctx.call("status.find", { query: { slug: "NOT_ACTIVATE", type: "USER" } });
				entity.status = status[0]._id;

				let errors = {};
				/* Validate password */
				if (!_.has(entity, "password")) {
					errors.password = translate("password_required");
				} else {
					entity.password = bcrypt.hashSync(entity.password, 10);
				}
				/* Validate phone number */
				let found = await this.adapter.findOne({ phone: entity.phone });
				if (found) {
					errors.phone = translate("phone_exists");
				}
				/* Validate email */
				found = await this.adapter.findOne({ email: entity.email });
				if (found) {
					errors.email = translate("email_exists");
				}
				/* Errors */
				if (_.keys(errors).length) {
					return responder.httpBadRequest(translate("validate"), errors);
				}
				/* Map to entity */
				let newEntity = {};
				_.values(this.settings.fields).forEach((key) => {
					newEntity[key] = entity[key] || null;
				});

				/* Send OTP */
				const isSend = await email.sendOTP(newEntity);
				/* Response */
				if (isSend) {
					/* Insert to database */
					const doc = await this.adapter.insert(newEntity);
					await this.entityChanged("created", doc, ctx);
					return responder.httpOK(doc, userTransformer);
				} else {
					return responder.httpError(translate("send_email_error"));
				}
			},
		},

		/**
     * List of users.
     *
     * @actions
     * @param {String} name - users
     * @param {Number} limit - Pagination limit
     * @param {Number} offset - Pagination offset
     *
     * @returns {Object} List of users
     */
		list: {
			...routers.list,
			cache: {
				keys: ["#userID", "name", "limit", "offset"],
			},
			async handler (ctx) {
				return this.loadList(ctx, userTransformer);
			},
		},

		/**
     * Find by id
     *
     * @param {String} id
     */
		get: {
			...routers.get,
			async handler (ctx) {
				return this.getEntityById(ctx, userTransformer);
			},
		},

		/**
     * Update
     *
     */
		update: {
			...routers.update,
		},

		/**
     * Remove
     *
     */
		remove: {
			...routers.remove,
		},

		/**
     * change-password with username & password
     *
     * @actions
     * @param {Object} phone - phone credentials
     *
     * @returns {Object} oldPassword - Logged in user with token
     *
     * @returns {Object} newPassword - Logged in user with token
     */
		changePassword: {
			...routers.passwordChange,
			async handler (ctx) {
				const { old_password, new_password } = ctx.params;
				const user = await this.getById(ctx.meta.auth.id);
				if (!user) {
					return responder.httpNotFound();
				}
				let errors = {};
				const res = await bcrypt.compare(old_password, user.password);
				if (!res) {
					errors.old_password = translate("old_password_not_mach");
				}
				/* Errors */
				if (_.keys(errors).length) {
					return responder.httpBadRequest(translate("validate"), errors);
				}
				const update = {
					$set: {
						password: bcrypt.hashSync(new_password, 10),
						updated_at: new Date(),
					},
				};
				const doc = await this.adapter.updateById(user._id, update);
				await this.entityChanged("updated", doc, ctx);
				return responder.httpOK(user, userTransformer);
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
		verify: {
			...routers.verify,
			async handler (ctx) {
				let request = ctx.params;
				let errors = {};
				const entity = await this.adapter.findById(request.id);
				if (!entity) {
					return responder.httpNotFound();
				}
				/* Validate otp */
				if (!_.has(request, "otp")) {
					errors.otp = translate("otp_required");
				}
				if (entity.otp !== request.otp) {
					errors.otp = translate("otp_validate");
				}
				if (_.keys(errors).length) {
					return responder.httpBadRequest(translate("validate"), errors);
				}
				/* Status */
				const status = await ctx.call("status.find", { query: { slug: "ACTIVATED", type: "USER" } });
				const update = {
					$set: {
						status: status[0]._id,
						updated_at: new Date(),
					},
				};
				/* Update database */
				const doc = await this.adapter.updateById(entity._id, update);
				await this.entityChanged("updated", doc, ctx);
				return responder.httpOK(doc, userTransformer);
			},
		},
	},

	/**
   * Methods
   */
	methods: {},
};
