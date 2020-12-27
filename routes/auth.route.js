const REQUEST = require("../enums/request-type.enum");

const routes = {
	login: {
		rest: `${ REQUEST.POST } /login`,
	},
	me: {
		rest: `${ REQUEST.GET } /me`,
		auth: "required",
	},
};

module.exports = routes;
