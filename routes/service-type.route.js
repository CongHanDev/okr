"use strict";

const basicRoute = require("../routes/basic.route");
const REQUEST = require("../enums/request-type.enum");

const routes = {
	...basicRoute,

	services: {
		rest: `${ REQUEST.GET } /:id/services`,
	},
};

module.exports = routes;
