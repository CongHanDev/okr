const nodeJsonTransformer = require("json-transformer-node");
const { translate } = require("../languages/index.language");
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
		if (data.rows) {
			let result = data.rows.map((record) => {
				return transformer ? nodeJsonTransformer.transform(record, transformer) : record;
			});

			let paginate = {
				count: data.rows.length,
				total: data.total,
				limit: data.pageSize,
				offset: data.page,
				total_pages: data.totalPages,
			};

			let dataResponse = {
				status: StatusCodes.OK,
				success: true,
				data: result,
			};
			if (data.rows.length) {
				dataResponse.pagination = paginate;
			}
			return dataResponse;
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
   * @param {String} messages
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
		throw new MoleculerError(messages + translate("not_found"), StatusCodes.NOT_FOUND);
	},
};
