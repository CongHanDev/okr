"use strict";

const { translate } = require("../languages/index.language");
const routers = require("../routes/user.route");
const schema = require("../schemas/user.schema");
const bcrypt = require("bcryptjs");
const responder = require("../mixins/response.mixin");
const email = require("../commons/emails/emailProvider");
const _ = require("lodash");
const uuid = require("uuid");
const cryptoRandomString = require("crypto-random-string");

module.exports = {
	...schema,

	/**
   * Actions
   */
	actions: {
		/**
     * Get
     *
     */

		get: {
			...routers.get,
		},

		/**
     * List
     *
     */
		list: {
			...routers.list,
		},
		/**
     * Update
     *
     */
		update: {
			...routers.update,
			async handler (ctx) {
				let request = await this.validateEntity(ctx.params);

				const updateEntity = {
					$set: this.mapEntity(request, true),
				};

				const doc = await this.adapter.updateById(ctx.params.id, updateEntity);
				const user = await this.transformDocuments(ctx, {}, doc);
				await this.entityChanged("updated", user, ctx);
				return user;
			},
		},

		/**
     * Remove
     *
     */
		remove: {
			...routers.remove,
		},
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
				const otp = cryptoRandomString({ length: 6, type: "numeric" }).toUpperCase();
				entity.otp = otp;
				/* Set ID */
				entity._id = uuid.v4();
				/* Created at */
				entity.created_at = new Date();
				/* Status */
				const status = await ctx.call("status.find", {
					query: { slug: "NOT_ACTIVATE", type: "USER" },
				});
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
					return responder.httpBadRequest(
						translate("validate"),
						errors,
					);
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
					return doc;
				} else {
					return responder.httpError(translate("send_email_error"));
				}
			},
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
					return responder.httpBadRequest(
						translate("validate"),
						errors,
					);
				}
				const update = {
					$set: {
						password: bcrypt.hashSync(new_password, 10),
						updated_at: new Date(),
					},
				};
				const doc = await this.adapter.updateById(user._id, update);
				await this.entityChanged("updated", doc, ctx);
				return user;
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
					$set: {
						status: status[0]._id,
						updated_at: new Date(),
					},
				};
				/* Update database */
				const doc = await this.adapter.updateById(entity._id, update);
				await this.entityChanged("updated", doc, ctx);
				return doc;
			},
		},
	},

	/**
   * Methods
   */
	methods: {
		async seedDB () {
			const pass = "123456";
			const emails = ["nhanhkut3@gmail.com", "admin@gmail.com", "local@gmail.com"];
			const phones = ["0932779270", "0344403435", "0987654321"];
			let data = [];
			for (let i = 0; i < emails.length; i++) {
				data.push({
					_id: `c6cdce48-0574-45f6-ad13-05f24d1b7471-${ i }`,
					avatar: "0de2b567-edb5-4f54-ba18-6d69653ed7ea",
					banner: "0de2b567-edb5-4f54-ba18-6d69653ed7ea",
					email: emails[i],
					birthday: "2020-11-02",
					password: bcrypt.hashSync(pass, 10),
					phone: phones[i],
					city: "1d84fccc-bdfe-49ee-ae20-c3f13d503a70-1",
					user_type: "83ece746-bdb2-42c7-8df8-0eb5325a08af-1",
					expertises: ["ccce1f35-cc78-404c-80f8-3d682f293abe-1", "ccce1f35-cc78-404c-80f8-3d682f293abe-2"],
					level: "7d1ae12d-74cc-4ff7-9651-5296c29c7f43-1",
					attaches: ["0de2b567-edb5-4f54-ba18-6d69653ed7ea"],
					status: "33a19fcf-a2c2-4beb-82f7-af9b46d18a3d",
					created_at: new Date(),
				});
			}
			await this.adapter.insertMany(data);
		},
	},
};
