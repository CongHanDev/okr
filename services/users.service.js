"use strict";

const { MoleculerClientError } = require("moleculer").Errors;
const routers = require("../routes/user.route");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const userTransformer = require("../transformers/user.transformer");
const responder = require("../mixins/response.mixin");
const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const email = require("../utits/emails/emailProvider");
const { google } = require("googleapis");

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
		rest: "",

		/** Public fields */
		fields: [
			"_id",
			"password",
			"phone",
			"email",
			"firstname",
			"lastname",
			"bio",
			"image",
			"cityId",
			"passport",
			"birtday",
			"address",
			"personType",
			"title",
			"introduce",
			"website",
			"areasOfExpertise",
			"level",
			"attach",
			"services",
			"status",
			"demons",
			"role",
		],

		/** Validator schema for entity */
		entityValidator: {
			phone: { type: "string", min: 2 },
			password: { type: "string", min: 6 },
			firstname: { type: "string", min: 2 },
			lastname: { type: "string", min: 2 },
			email: { type: "email" },
			bio: { type: "string", optional: true },
			image: { type: "string", optional: true },
			cityId: { type: "string", optional: true },
			passport: { type: "string", min: 8, optional: true },
			birtday: { type: "date", optional: true },
			personType: { type: "string", optional: true },
			title: { type: "string", optional: true },
			address: { type: "string", optional: true },
			introduce: { type: "string", optional: true },
			areasOfExpertiseId: { type: "string", optional: true },
			levelId: { type: "string", optional: true },
			attach: { type: "string", optional: true },
			services: { type: "array", items: "string", optional: true },
			status: { type: "string", optional: true },
			demons: { type: "number", optional: true },
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
			async handler(ctx) {
				let entity = ctx.params;
				await this.validateEntity(entity);
				if (entity.phone) {
					const found = await this.adapter.findOne({
						phone: entity.phone,
					});
					if (found)
						throw new MoleculerClientError(
							"phone is exist!",
							422,
							"",
							[{ field: "phone", message: "is exist" }]
						);
				}

				if (entity.phone) {
					const found = await this.adapter.findOne({
						phone: entity.phone,
					});
					if (found)
						throw new MoleculerClientError(
							"phone is exist!",
							422,
							"",
							[{ field: "phone", message: "is exist" }]
						);
				}

				if (entity.email) {
					const found = await this.adapter.findOne({
						email: entity.email,
					});
					if (found)
						throw new MoleculerClientError(
							"Email is exist!",
							422,
							"",
							[{ field: "email", message: "is exist" }]
						);
				}

				entity.password = bcrypt.hashSync(entity.password, 10);
				entity.firstname = entity.firstname || "";
				entity.lastname = entity.lastname || "";
				entity.bio = entity.bio || "";
				entity.image = entity.image || "";
				entity.passport = entity.passport || null;
				entity.birtday = entity.birtday || null;
				entity.personType = entity.personType || null;
				entity.title = entity.title || "";
				entity.address = entity.address || "";
				entity.introduce = entity.introduce || "";
				entity.areasOfExpertiseId = entity.areasOfExpertiseId || "";
				entity.levelId = entity.levelId || "";
				entity.attach = entity.attach || "";
				entity.services = entity.services || null;
				entity.demons = entity.demons || "";
				entity.status = "";
				entity.role = 1;
				entity.createdAt = new Date();

				const doc = await this.adapter.insert(entity);
				const user = await this.transformDocuments(ctx, {}, doc);
				await this.entityChanged("created", user, ctx);
				return responder.httpOK(user, userTransformer);
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
		getAll: {
			...routers.getAll,
			cache: {
				keys: ["#userID", "name", "limit", "offset"],
			},
			async handler(ctx) {
				const limit = ctx.params.limit ? Number(ctx.params.limit) : 20;
				const offset = ctx.params.offset
					? Number(ctx.params.offset)
					: 0;
				const name = ctx.params.name || null;

				let params = {
					limit,
					offset,
				};

				if (name) params.search = name;

				let countParams;

				countParams = Object.assign({}, params);
				// Remove pagination params
				if (countParams && countParams.limit) countParams.limit = null;
				if (countParams && countParams.offset)
					countParams.offset = null;

				const res = await this.Promise.all([
					// Get rows
					this.adapter.find(params),

					// Get count of all rows
					this.adapter.count(countParams),
				]);
				const docs = await this.transformDocuments(ctx, params, res[0]);

				const page = offset ? offset : 1;

				const r = await this.transformResult(ctx, docs, ctx.meta.user);
				r.totalRows = res[1];
				r.limit = limit;
				r.offset = page;
				r.totalPages = Math.ceil(res[1] / limit);

				return responder.httpOK(r, userTransformer);
			},
		},

		/**
		 * Find by id
		 *
		 * @param {String} id
		 */
		find: {
			...routers.find,
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
			async handler(ctx) {
				const { oldPassword, newPassword } = ctx.params;
				const newData = await this.getById(ctx.meta.user._id);
				if (!newData)
					throw new MoleculerClientError(
						"User is invalid!",
						422,
						"",
						[{ field: "User", message: "is not found" }]
					);

				const res = await bcrypt.compare(oldPassword, newData.password);
				if (!res)
					throw new MoleculerClientError("Wrong password!", 422, "", [
						{ field: "password", message: "is not found" },
					]);

				newData.updatedAt = new Date();
				newData.password = bcrypt.hashSync(newPassword, 10);
				const update = {
					$set: newData,
				};
				const doc = await this.adapter.updateById(newData._id, update);

				const user = await this.transformDocuments(ctx, {}, doc);
				await this.entityChanged("updated", user, ctx);
				return responder.httpOK(user, userTransformer);
			},
		},

		/**
		 * forgot-password.
		 * Auth is required!
		 *
		 * @actions

		 * @param {Object} email - email entity
		 *
		 * @returns {Object} Created email entity
		 */
		forgotPassword: {
			...routers.passwordForgot,
			async handler(ctx) {
				let entity = ctx.params;

				const found = await this.adapter.findOne({
					email: entity.email,
				});

				if (!found)
					throw new MoleculerClientError(
						"Email does not exist!",
						422,
						"",
						[{ field: "Email", message: "does not exist" }]
					);

				await email.sendPasswordReset(found);
				return responder.httpOK();
			},
		},

		/**
		 *  reset-password.
		 * Auth is required!
		 *
		 * @actions

		 * @param {String} email - email entity
		 * @param {String} newPassword - email entity
		 *
		 * @returns {Object} Created email entity
		 */
		resetPassword: {
			...routers.passwordReset,
			async handler(ctx) {
				let entity = ctx.params;

				const newData = await this.adapter.findOne({
					email: entity.email,
				});

				if (!newData)
					throw new MoleculerClientError(
						"Email does not exist!",
						422,
						"",
						[{ field: "Email", message: "does not exist" }]
					);

				newData.updatedAt = new Date();
				newData.password = bcrypt.hashSync(entity.newPassword, 10);
				const update = {
					$set: newData,
				};
				const doc = await this.adapter.updateById(newData._id, update);

				const user = await this.transformDocuments(ctx, {}, doc);
				await this.entityChanged("updated", user, ctx);
				return responder.httpOK(user, userTransformer);
			},
		},

		/**
		 * Facebook with username & password
		 *
		 * @actions
		 * @param {Object} user - User credentials
		 *
		 * @returns {Object} Logged in user with token
		 */
		social: {
			...routers.social,
			async handler(ctx) {
				const { access_token, social } = ctx.params.user;
				let user = {};
				if (social === "facebook") {
					user = await this.facebook(access_token);
				} else {
					user = await this.google(access_token);
				}

				const newData = await this.adapter.findOne({
					email: user.email,
				});
				if (!newData) {
					user.firstname = user.firstname || "";
					user.lastname = user.lastname || "";
					user.bio = user.bio || "";
					user.image = user.image || null;
					user.createdAt = new Date();
					await this.adapter.insert(user);
				} else {
					user = { ...newData };
				}
				const doc = await this.transformDocuments(ctx, {}, user);
				return responder.httpOK(doc, userTransformer);
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
			async handler(ctx) {
				const newData = ctx.params;
				newData.status = "1";
				newData.updatedAt = new Date();
				const update = {
					$set: newData,
				};
				const doc = await this.adapter.updateById(
					ctx.meta.user._id,
					update
				);
				return responder.httpOK(doc, userTransformer);
			},
		},

		/**
		 * Update avatar.
		 *
		 */
		avatar: {
			...routers.avatar,
			async handler(ctx) {
				const newData = ctx.params;
				// eslint-disable-next-line no-self-assign
				newData.image = newData.image;
				newData.updatedAt = new Date();
				const update = {
					$set: newData,
				};

				const doc = await this.adapter.updateById(
					ctx.meta.user._id,
					update
				);
				return responder.httpOK(doc, userTransformer);
			},
		},

		/**
		 * Get current user entity.
		 *
		 * @actions
		 *
		 * @returns {String} User entity
		 */
		sentOTP: {
			...routers.sentOTP,
			async handler(ctx) {
				const newData = ctx.params;
				const phoneNumber = newData.phone;
				const identitytoolkit = google.identitytoolkit({
					auth: "AIzaSyCfZ0pClVVlqMdTdiwC6yWgEWB9XUJEibY",
					version: "v3",
				});
				const response = await identitytoolkit.relyingparty.sendVerificationCode(
					{
						phoneNumber,
						recaptchaToken: "generated_recaptcha_token",
					}
				);

				const selectInfo = response.data.sessionInfo;

				newData.status = "1";
				newData.updatedAt = new Date();
				const update = {
					$set: newData,
				};
				await this.adapter.updateById(ctx.meta.user._id, update);
				return selectInfo;
			},
		},

		/**
		 * Follow a user
		 * Auth is required!
		 *
		 * @actions
		 *
		 * @param {String} phone - Followed phone
		 * @returns {Object} Current user entity
		 */
		follow: {
			...routers.follow,
			async handler(ctx) {
				const user = await this.adapter.findOne({
					phone: ctx.params.phone,
				});
				if (!user)
					throw new MoleculerClientError("User not found!", 404);

				await ctx.call("follows.add", {
					user: ctx.meta.user._id.toString(),
					follow: user._id.toString(),
				});
				const doc = await this.transformDocuments(ctx, {}, user);
				return responder.httpOK(doc, userTransformer);
			},
		},

		/**
		 * Unfollow a user
		 * Auth is required!
		 *
		 * @actions
		 *
		 * @param {String} username - Unfollowed username
		 * @returns {Object} Current user entity
		 */
		unfollow: {
			...routers.unfollow,
			async handler(ctx) {
				const user = await this.adapter.findOne({
					phone: ctx.params.phone,
				});
				if (!user)
					throw new MoleculerClientError("User not found!", 404);

				await ctx.call("follows.delete", {
					user: ctx.meta.user._id.toString(),
					follow: user._id.toString(),
				});
				const doc = await this.transformDocuments(ctx, {}, user);
				return responder.httpOK(doc, userTransformer);
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Get info in facebook.
		 *
		 * @param {String} access_token
		 */
		async facebook(access_token) {
			const fields = "id, name, email, picture";
			const url = "https://graph.facebook.com/me";
			const params = { access_token, fields };
			console.log("response", params);
			const response = await axios.get(url, { params });

			const {
				id,
				first_name,
				last_name,
				email,
				picture,
				name,
			} = response.data;
			return {
				service: "facebook",
				image: picture.data.url,
				id,
				first_name: first_name || name,
				email,
				last_name,
			};
		},

		/**
		 * Get info in google.
		 *
		 * @param {String} access_token
		 */
		async google(access_token) {
			const url = "https://www.googleapis.com/oauth2/v3/userinfo";
			const params = { access_token };
			const response = await axios.get(url, { params });
			const { sub, name, email, picture } = response.data;
			return {
				service: "google",
				image: picture,
				id: sub,
				firstname: name,
				email,
			};
		},

		/**
		 * Transform the result entities to follow the RealWorld API spec
		 *
		 * @param {Context} ctx
		 * @param {Array} entities
		 * @param {Object} user - Logged in user
		 */
		async transformResult(ctx, entities, user) {
			if (Array.isArray(entities)) {
				const rows = await this.Promise.all(
					entities.map((item) =>
						this.transformEntities(ctx, item, user)
					)
				);
				return { rows };
			} else {
				const rows = await this.transformEntities(ctx, entities, user);
				return { rows };
			}
		},

		/**
		 * Transform a result entity to follow the RealWorld API spec
		 *
		 * @param {Context} ctx
		 * @param {Object} entity
		 * @param {Object} user - Logged in user
		 */
		async transformEntities(ctx, entity, loggedInUser) {
			if (!entity) return this.Promise.resolve();
			return entity;
		},
	},
};
