"use strict";

const DbService = require("../mixins/db.mixin");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");
const schemas = {
	name: "files",
	mixins: [DbService("files"), CacheCleanerMixin(["cache.clean.files"])],
	settings: {
		fields: [
			"_id",
			"name",
			"upload_name",
			"mime_type",
			"size",
			"path",
			"model",
			"created_by",
			"created_at",
			"updated_at",
			"deleted_at",
		],
		indexes: { "$**": "text" },
	}
};

module.exports = schemas;
