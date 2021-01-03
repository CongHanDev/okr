"use strict";

const DbService = require("../mixins/db.mixin");

module.exports = {
	name: "files",
	mixins: [
		DbService("files"),
	],
	/**
   * Default settings
   */
	settings: {
		fields: ["_id", "name", "upload_name", "mime_type", "size", "path", "model", "created_by"],
    rest: "/files",
	},

	/**
   * Actions
   */
	actions: {},

	/**
   * Methods
   */
	methods: {
	},
};
