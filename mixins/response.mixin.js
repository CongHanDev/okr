const nodeJsonTransformer = require("json-transformer-node");
const { StatusCodes } = require("http-status-codes");
const _ = require("lodash");

module.exports = {
	/**
	 * Response success with status 200
	 *
	 * @param {Object} data
	 * @param {Object} transformer
	 */
	httpOK (data = null, transformer = null) {
		if (!data && !transformer) {
			return {};
		} else if (data && !transformer) {
			return data;
		}
		if (_.has(data, "rows")) {
			let result = data.rows.map((record) => {
				return nodeJsonTransformer.transform(record, transformer);
			});
			return {
				status: StatusCodes.OK,
				success: true,
				data: result,
			};
		}
		return {
			status: StatusCodes.OK,
			success: true,
			data: nodeJsonTransformer.transform(data, transformer),
		};
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
		return {
			status: StatusCodes.BAD_REQUEST,
			success: false,
			type: type,
			errors: errors,
		};
	},

	/**
	 * Response unauthorized with status 401
	 *
	 * @param {Object} messages
	 */
	httpUnauthorized (messages) {
		return {
			status: StatusCodes.UNAUTHORIZED,
			success: false,
			type: "Unauthorized",
			errors: { messages: messages },
		};
	},
};
