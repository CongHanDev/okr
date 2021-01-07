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
			handler (ctx) {
				return this.save("images", ctx);
			},
		},

		uploadAvatar: {
			auth: "required",
			handler (ctx) {
				return this.save("avatar", ctx);
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {
		save (model, ctx) {
			return new this.Promise((resolve, reject) => {
				const currentPath = `/assets/${ model }`
				const uploadDir = path.join(__dirname, `../public${ currentPath }`);
				mkdir(uploadDir);
				const extension = ctx.meta.filename.split(".").pop();
				const id = uuid.v4();
				let fileName = `${ id }.${ extension }`;
				const filePath = path.join(uploadDir, fileName);

				const fileData = {
					_id: id,
					name: fileName,
					upload_name: ctx.meta.filename,
					mime_type: ctx.meta.mimetype,
					path: path.join(currentPath,fileName) ,
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
