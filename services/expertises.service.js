"use strict";

const DbService = require("../mixins/db.mixin");

module.exports = {
	name: "expertises",
	mixins: [
		DbService("expertises"),
	],
	/**
   * Default settings
   */
	settings: {
    /** REST Basepath */
    rest: "/expertises",

		fields: ["_id", "name", "created_at", "updated_at", "deleted_at"],
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
