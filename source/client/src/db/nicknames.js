const mongoose = require("mongoose");

const nicksSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	userTag: {
		type: String,
		required: true,
	},
	guildId: {
		type: String,
		required: true,
	},
	guildName: {
		type: String,
		required: true,
	},
	nicknames: {
		type: [Object],
		required: true,
	},
	lastUpdated: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

module.exports = mongoose.model("nicknames", nicksSchema);
