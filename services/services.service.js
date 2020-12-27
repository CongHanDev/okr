"use strict";

const { ForbiddenError } = require("moleculer-web").Errors;
const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
	name: "services",
	mixins: [DbService("services"), CacheCleanerMixin(["cache.clean.services"])],
	/**
	 * Default settings
	 */
	settings: {
		fields: [
			"_id",
			"slug",
			"name",
			"category",
			"description",
			"image",
			"acronym",
		],
		entityValidator: {
			slug: { type: "string" },
			name: { type: "string" },
			category: { type: "string" },
			description: { type: "string", optional: true },
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
				entity.category = entity.category;
				entity.description = entity.description;
				entity.acronym = entity.acronym;
				entity.image = entity.image;
				entity.createdAt = new Date();
				entity.updatedAt = new Date();
				const doc = await this.adapter.insert(entity);
				await ctx.call("category.updateByService", {
					categoryId: entity.category,
					serviceId: doc._id,
				});

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
		update: {
			auth: "required",
			params: {
				slug: { type: "string" },
				name: { type: "string", min: 1 },
				category: { type: "string", min: 1 },
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
		 * List of category by categories.
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
				keys: ["#userID", "name", "limit", "offset", "category"],
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
				const categoryId = ctx.params.categoryId || null;

				let params = {
					limit,
					offset,
					sort: ["-name"],
					query: {},
				};

				if (name) params.search = name;
				if (categoryId) params.query.category = categoryId;

				let countParams;

				countParams = Object.assign({}, params);
				// Remove pagination params
				if (countParams && countParams.limit) countParams.limit = null;
				if (countParams && countParams.offset) countParams.offset = null;

				console.log("select params: ", params);
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
