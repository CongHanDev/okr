"use strict";
const { MoleculerClientError } = require("moleculer").Errors;
const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const fs = require("fs");
const path = require("path");
const mkdir = require("mkdirp").sync;
const uuidv4 = require("uuid");
const uploadDir = path.join(__dirname, "../public/assets/avatar");
mkdir(uploadDir);

module.exports = {
	name: "storage",
	mixins: [DbService("storage"), CacheCleanerMixin(["cache.clean.storage"])],

	/**
	 * Actions
	 */
	actions: {
		uploadMulti: {
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					const filePath = path.join(uploadDir, ctx.meta.filename);
					const f = fs.createWriteStream(filePath);
					f.on("close", () =>
						resolve({ url: "/assets/avatar/" + ctx.meta.filename })
					);
					f.on("error", (err) => reject(err));
					console.log("filePath", ctx.meta.filename);
					ctx.params.pipe(f);
				});
			},
		},

		uploadSingle: {
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					const filePath = path.join(uploadDir, imageName);
					const f = fs.createWriteStream(imageName);
					f.on("close", () => resolve({ url: "/assets/avatar/" + filePath }));
					f.on("error", (err) => reject(err));

					ctx.params.pipe(f);
				});
			},
		},

		avatar: {
			auth: "required",
			handler(ctx) {
				return new this.Promise((resolve, reject) => {
					const type = ctx.meta.mimetype;
					let typeImage = "jpg";
					if (type !== "image/png" && type !== "image/jpeg")
						throw new MoleculerClientError("File type not support");
					if (type !== "image/png") typeImage = "png";
					let imageName = `${Date.now()}-${uuidv4()}.${typeImage}`;
					const filePath = path.join(uploadDir, imageName);
					const f = fs.createWriteStream(filePath);
					f.on("close", async () => {
						const image = "/assets/avatar/" + imageName;
						await ctx.call("users.avatar", {
							image,
						});
						resolve(image);
					});
					f.on("error", (err) => reject(err));

					ctx.params.pipe(f);
				});
			},
		},
		saveParams: {
			handler(ctx) {
				// get params from url
				return ctx.params.$params;
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {},
};
