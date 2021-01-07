const enLanguage = require("../languages/en.language");
const viLanguage = require("../languages/vi.language");
const _ = require("lodash");

const messages = {
	en: { ...enLanguage },
	vi: { ...viLanguage },
};

module.exports = {
	translate (key) {
		if (_.has(messages, process.env.LANGUAGE) && _.has(messages[`${ process.env.LANGUAGE }`], key)) {
			return (messages[`${ process.env.LANGUAGE }`])[`${ key }`];
		}
		return key;
	},
};
