"use strict";

const fs = require("fs");
const _ = require("lodash");
const DbService = require("moleculer-db");
const responder = require("../mixins/response.mixin");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = function (collection) {
	const cacheCleanEventName = `cache.clean.${collection}`;

	const schema = {
		mixins: [DbService, responder],

		events: {
			/**
			 * Subscribe to the cache clean event. If it's triggered
			 * clean the cache entries for this service.
			 *
			 * @param {Context} ctx
			 */
			async [cacheCleanEventName]() {
				if (this.broker.cacher) {
					await this.broker.cacher.clean(`${this.fullName}.*`);
				}
			},
		},

		methods: {
			/**
			 * Send a cache clearing event when an entity changed.
			 *
			 * @param {String} type
			 * @param {any} json
			 * @param {Context} ctx
			 */
			async entityChanged(type, json, ctx) {
				ctx.broadcast(cacheCleanEventName);
			},
			async loadList(ctx, transformer) {
				const limit = ctx.params.limit
					? Number(ctx.params.limit)
					: process.env.LIMIT;
				const offset = ctx.params.offset
					? Number(ctx.params.offset)
					: 0;
				const name = ctx.params.name || null;
				const populates = _.keys(this.settings.populates);
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
				params.total = res[1];
				params.currentpage = page;
				return this.httpOK(docs, transformer, params);
			},

			async getEntityById(ctx, transformer) {
				const entity = await this.adapter.findById(ctx.params.id);
				if (!entity) {
					this.httpNotFound();
				}
				return this.httpOK(entity, transformer);
			},

			mapEntity(request, isUpdate = false) {
				/* Map to entity */
				let newEntity = {};
				const fields = _.intersection(
					_.values(this.settings.fields),
					_.keys(request)
				);
				fields.forEach((key) => {
					newEntity[key] =
						request[key] !== null ? request[key] : null;
				});
				if (isUpdate) {
					_.values(this.settings.fieldsNotUpdate).forEach((key) => {
						delete newEntity[key];
						if (newEntity["_id"]) {
							delete newEntity["_id"];
						}
						if (newEntity["id"]) {
							delete newEntity["id"];
						}
					});
				}
				return newEntity;
			},
		},

		async started() {
			// Check the count of items in the DB. If it's empty,
			// call the `seedDB` method of the service.
			if (this.seedDB) {
				const count = await this.adapter.count();
				if (count == 0) {
					this.logger.info(
						`The '${collection}' collection is empty. Seeding the collection...`
					);
					await this.seedDB();
					this.logger.info(
						"Seeding is done. Number of records:",
						await this.adapter.count()
					);
				}
			}
		},
	};

	if (process.env.MONGO_URI) {
		// Mongo adapter
		const MongoAdapter = require("moleculer-db-adapter-mongo");

		schema.adapter = new MongoAdapter(process.env.MONGO_URI, {
			keepAlive: 1,
		});
		schema.collection = collection;
	} else if (process.env.NODE_ENV === "test") {
		// NeDB memory adapter for testing
		schema.adapter = new DbService.MemoryAdapter();
	} else {
		// NeDB file DB adapter

		// Create data folder
		if (!fs.existsSync("./data")) {
			fs.mkdirSync("./data");
		}

		schema.adapter = new DbService.MemoryAdapter({
			filename: `./data/${collection}.db`,
		});
	}

	return schema;
};
