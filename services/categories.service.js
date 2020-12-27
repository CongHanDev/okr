"use strict";

const { ForbiddenError } = require("moleculer-web").Errors;
const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
	name: "category",
	mixins: [
		DbService("category"),
		CacheCleanerMixin(["cache.clean.category"]),
	],
	/**
	 * Default settings
	 */
	settings: {
		fields: [
			"_id",
			"slug",
			"name",
			"description",
			"services",
			"image",
			"acronym",
		],
		entityValidator: {
			slug: { type: "string" },
			name: { type: "string" },
			description: { type: "string", optional: true },
			services: { type: "array", optional: true },
			image: { type: "string", optional: true },
			acronym: { type: "string", optional: true },
		},
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Create a category.
		 * Auth is required!
		 *
		 * @actions
		
		 * @param {Object} category - category entity
		 *
		 * @returns {Object} Created category entity
		 */
		create: {
			auth: "required",
			params: {},
			async handler(ctx) {
				let entity = ctx.params;

				await this.validateEntity(entity);
				entity.slug = entity.slug;
				entity.name = entity.name;
				entity.description = entity.description;
				entity.acronym = entity.acronym;
				entity.image = entity.image;
				entity.createdAt = new Date();
				entity.updatedAt = new Date();

				const doc = await this.adapter.insert(entity);
				let json = await this.transformDocuments(ctx, {}, doc);
				json = await this.transformEntity(ctx, json, ctx.meta.user);
				await this.entityChanged("created", json, ctx);
				return json;
			},
		},

		/**
		 * Update a category.
		 * Auth is required!
		 *
		 * @actions
		 * @param {String} id - category ID
		 * @param {Object} category - category modified fields
		 *
		 * @returns {Object} Updated category entity
		 */
		updateByService: {
			auth: "required",
			rest: "PUT /updateByService",
			params: {
				categoryId: { type: "string" },
				serviceId: { type: "string", min: 1 },
			},
			async handler(ctx) {
				let newData = ctx.params;

				newData.updatedAt = new Date();

				const update = {
					$set: newData,
					$push: { services: newData.serviceId },
				};

				const doc = await this.adapter.updateById(newData.categoryId, update);
				const entity = await this.transformDocuments(ctx, {}, doc);
				const json = await this.transformResult(ctx, entity, ctx.meta.user);
				await this.entityChanged("updated", json, ctx);
				return json;
			},
		},

		/**
		 * Update a category.
		 * Auth is required!
		 *
		 * @actions
		 * @param {String} id - category ID
		 * @param {Object} category - category modified fields
		 *
		 * @returns {Object} Updated category entity
		 */
		update: {
			auth: "required",
			params: {
				slug: { type: "string" },
				name: { type: "string", min: 1 },
				description: { type: "string", min: 1 },
				image: { type: "string", min: 1 },
				acronym: { type: "string", min: 1 },
			},
			async handler(ctx) {
				let newData = ctx.params;
				newData.updatedAt = new Date();

				const update = {
					$set: newData,
				};

				const doc = await this.adapter.updateById(ctx.params.id, update);
				const entity = await this.transformDocuments(ctx, {}, doc);
				const json = await this.transformResult(ctx, entity, ctx.meta.user);
				await this.entityChanged("updated", json, ctx);
				return json;
			},
		},

		/**
		 * List of category.
		 *
		 * @actions
		 * @param {String} name - category ID
		 * @param {Number} limit - Pagination limit
		 * @param {Number} offset - Pagination offset
		 *
		 * @returns {Object} List of category
		 */
		list: {
			cache: {
				keys: ["#userID", "name", "limit", "offset"],
			},
			rest: "GET /",
			params: {
				limit: { type: "number", optional: true, convert: true },
				offset: { type: "number", optional: true, convert: true },
			},
			async handler(ctx) {
				const limit = ctx.params.limit ? Number(ctx.params.limit) : 20;
				const offset = ctx.params.offset ? Number(ctx.params.offset) : 0;
				const name = ctx.params.name || null;

				let params = {
					limit,
					offset,
					sort: ["-name"],
					query: {},
				};

				if (name) params.search = name;

				let countParams;

				countParams = Object.assign({}, params);
				// Remove pagination params
				if (countParams && countParams.limit) countParams.limit = null;
				if (countParams && countParams.offset) countParams.offset = null;

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

				return r;
			},
		},

		/**
		 * List of category.
		 *
		 * @actions
		 * @param {String} name - category ID
		 * @param {Number} limit - Pagination limit
		 * @param {Number} offset - Pagination offset
		 *
		 * @returns {Object} List of category
		 */
		services: {
			cache: {
				keys: ["#userID", "serviceId"],
			},
			rest: "GET /services",
			params: {
				id: { type: "string", optional: true, convert: true },
			},
			async handler(ctx) {
				const id = ctx.params.serviceId;

				const json = await this.adapter.findOne({ _id: id }, [
					{
						$lookup: {
							from: "services",
							localField: "services",
							foreignField: "_id",
							as: "services",
						},
					},
				]);

				return json;
			},
		},

		/**
		 * Remove a comment
		 * Auth is required!
		 *
		 * @actions
		 * @param {String} id - Comment ID
		 *
		 * @returns {Number} Count of removed comments
		 */
		remove: {
			auth: "required",
			params: {
				id: { type: "any" },
			},
			async handler(ctx) {
				const comment = await this.getById(ctx.params.id);
				if (comment.author !== ctx.meta.user._id.toString())
					throw new ForbiddenError();

				const json = await this.adapter.removeById(ctx.params.id);
				await this.entityChanged("removed", json, ctx);
				return json;
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
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
					entities.map((item) => this.transformEntity(ctx, item, user))
				);
				return { rows };
			} else {
				const rows = await this.transformEntity(ctx, entities, user);
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
		async transformEntity(ctx, entity, loggedInUser) {
			if (!entity) return this.Promise.resolve();
			return entity;
		},
	},
};
