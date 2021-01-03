const REQUEST = require("../enums/request-type.enum");

const routes = {
	create: {
		rest: `${ REQUEST.POST } `,
	},

	list: {
		rest: `${ REQUEST.GET } `,
	},

	get: {
		rest: `${ REQUEST.GET } /:id`,
	},

	update: {
		rest: `${ REQUEST.PUT } /:id`,
	},

	remove: {
		rest: `${ REQUEST.DELETE } /:id`,
	},
};

module.exports = routes;
