"use strict";

const basicRoute = require("../routes/basic.route");
const REQUEST = require("../enums/request-type.enum");

const routes = {
	...basicRoute,
	data: {
		rest: `${ REQUEST.GET } /:id/data`,
	},
};

module.exports = routes;
