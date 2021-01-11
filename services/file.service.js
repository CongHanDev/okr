"use strict";

const routers = require("../routes/file.route");
const schema = require("../schemas/file.schema");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const mkdir = require("mkdirp").sync;

module.exports = {
	...schema,

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Create
		 *
		 */
		create: {
			...routers.create,
		},

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
		},

		/**
		 * Remove
		 *
		 */
		remove: {
			...routers.remove,
		},

		uploadSingle: {
			auth: "required",
			handler(ctx) {
				return this.save("images", ctx);
			},
		},

		uploadAvatar: {
			auth: "required",
			async handler(ctx) {
				const file = await this.save("avatar", ctx);
				await ctx.call("user.update", {
					id: ctx.meta.auth.id,
					avatar_id: { ...file }._id,
				});
				return file;
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		async seedDB() {
			const data = [
				{
					_id: "0de2b567-edb5-4f54-ba18-6d69653ed7ea",
					name: "0de2b567-edb5-4f54-ba18-6d69653ed7ea.png",
					upload_name: "seeder.png",
					mime_type: "image/png",
					path:
						"/assets/avatar/0de2b567-edb5-4f54-ba18-6d69653ed7ea.png",
					model: "avatar",
					created_at: new Date(),
				},
				{
					_id: "0de2b567-edb5-4f54-ba18-6d69653ed7ea-1",
					name: "0de2b567-edb5-4f54-ba18-6d69653ed7ea-1.png",
					upload_name: "seeder.png",
					mime_type: "image/png",
					path:
						"/assets/banner/0de2b567-edb5-4f54-ba18-6d69653ed7ea-1.png",
					model: "avatar",
					created_at: new Date(),
				},
				{
					_id: "0de2b567-edb5-4f54-ba18-6d69653ed7ea-2",
					name: "0de2b567-edb5-4f54-ba18-6d69653ed7ea-2.png",
					upload_name: "seeder.png",
					mime_type: "image/png",
					path:
						"/assets/banner/0de2b567-edb5-4f54-ba18-6d69653ed7ea-2.png",
					model: "avatar",
					created_at: new Date(),
				},
				{
					_id: "0de2b567-edb5-4f54-ba18-6d69653ed7ea-3",
					name: "0de2b567-edb5-4f54-ba18-6d69653ed7ea-3.png",
					upload_name: "seeder.png",
					mime_type: "image/png",
					path:
						"/assets/banner/0de2b567-edb5-4f54-ba18-6d69653ed7ea-3.png",
					model: "avatar",
					created_at: new Date(),
				},
			];
			await this.adapter.insertMany([data]);
		},
		async save(model, ctx) {
			return new this.Promise((resolve, reject) => {
				const currentPath = `/assets/${model}`;
				const uploadDir = path.join(
					__dirname,
					`../public${currentPath}`
				);
				mkdir(uploadDir);
				const extension = ctx.meta.filename.split(".").pop();
				const id = uuid.v4();
				let fileName = `${id}.${extension}`;
				const filePath = path.join(uploadDir, fileName);

				const fileData = {
					_id: id,
					name: fileName,
					upload_name: ctx.meta.filename,
					mime_type: ctx.meta.mimetype,
					path: path.join(currentPath, fileName),
					model: model,
					created_by: ctx.meta.auth.id,
					created_at: new Date(),
				};
				const res = this.adapter.insert(fileData);
				if (res) {
					const f = fs.createWriteStream(filePath);
					f.on("close", () => resolve(res));
					f.on("error", (err) => reject(err));
					ctx.params.pipe(f);
				}
			});
		},
	},
};
