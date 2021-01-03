const nodeJsonTransformer = require("json-transformer-node");
const { StatusCodes } = require("http-status-codes");
const { MoleculerError } = require("moleculer").Errors;
const _ = require("lodash");

module.exports = {
	/**
	 * Response success with status 200
	 *
	 * @param {Object} data || {Array} data
	 * @param {Object} transformer
	 */
	httpOK (data = null, transformer = null, params = null) {
		if (Array.isArray(data)) {
			let result = data.map((record) => {
				return nodeJsonTransformer.transform(record, transformer);
			});

			let paginate = {
				count: data.length,
				total: params.total,
				limit: params.limit,
				offset: params.currentpage,
				total_pages: Math.ceil(params.total / params.limit),
			};

			return {
				status: StatusCodes.OK,
				success: true,
				data: result,
				pagination: paginate,
			};
		}

		return {
			status: StatusCodes.OK,
			success: true,
			data: transformer ? nodeJsonTransformer.transform(data, transformer) : data,
		};
	},

	/**
	 * Response bad request with status 400
	 *
	 * @param {String} type
	 * @param {Object} messages
	 */
	httpError (messages) {
		throw new MoleculerError(messages, StatusCodes.INTERNAL_SERVER_ERROR);
	},

	/**
	 * Response bad request with status 400
	 *
	 * @param {String} type
	 * @param {Object} messages
	 */
	httpBadRequest (type, messages) {
		let errors = [];
		_.forOwn(messages, function (value, key) {
			errors.push({ field: key, message: value });
		});
    throw new MoleculerError(type, StatusCodes.BAD_REQUEST, null, errors);
	},

	/**
	 * Response unauthorized with status 401
	 *
	 * @param {Object} messages
	 */
	httpUnauthorized: function (messages = "") {
		throw new MoleculerError(messages, StatusCodes.UNAUTHORIZED);
	},

	/**
	 * Response unauthorized with status 401
	 *
	 * @param {string} messages
	 */
	httpNotFound (messages = "") {
    throw new MoleculerError(messages, StatusCodes.NOT_FOUND);
	},
};
