const mongoose = require("mongoose");

const Schema = mongoose.Schema({
	guildId: {
		type: String,
		required: true,
	},
	pruning: {
		type: Boolean,
		required: true,
		default: true,
	},
});

module.exports = mongoose.model("music-pruning", Schema);
