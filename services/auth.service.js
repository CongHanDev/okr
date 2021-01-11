"use strict";

const authActions = require("../actions/auth.action");
const CacheCleanerMixin = require("../mixins/cache.cleaner.mixin");

module.exports = {
	name: "auth",
  mixins: [CacheCleanerMixin(["cache.clean.auth"])],
	actions: authActions,
};
