"use strict";

const { ForbiddenError } = require("moleculer-web").Errors;
const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
	name: "persionTypes",
	mixins: [
		DbService("persionTypes"),
		CacheCleanerMixin(["cache.clean.persionTypes"]),
	],
	/**
	 * Default settings
	 */
	settings: {
		fields: ["_id", "name"],
		entityValidator: {
			name: { type: "string" },
			acronym: { type: "number" },
		},
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Create a persionTypes.
		 * Auth is required!
		 *
		 * @actions
		
		 * @param {Object} persionTypes - persionTypes entity
		 *
		 * @returns {Object} Created persionTypes entity
		 */
		create: {
			auth: "required",
			params: {},
			async handler(ctx) {
				let entity = ctx.params;

				await this.validateEntity(entity);
				entity.name = entity.name;
				entity.acronym = entity.acronym;
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
		 * Update a persionTypes.
		 * Auth is required!
		 *
		 * @actions
		 * @param {String} id - persionTypes ID
		 * @param {Object} persionTypes - persionTypes modified fields
		 *
		 * @returns {Object} Updated persionTypes entity
		 */
		update: {
			auth: "required",
			rest: "PUT /persionType",
			params: {},
			async handler(ctx) {
				let newData = ctx.params;
				await this.validateEntity(newData);
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

		list: {
			rest: "GET /",
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
				const persionTypes = await this.Promise.all(
					entities.map((item) => this.transformEntity(ctx, item, user))
				);
				return { persionTypes };
			} else {
				const persionTypes = await this.transformEntity(ctx, entities, user);
				return { persionTypes };
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
