const mongoose = require("mongoose");

//This is what warn commands use to store data, each object is what is written to the database
const warnSchema = mongoose.Schema({
	warnId: {
		type: String,
		required: true,
	},
	warnTag: {
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
	warnings: {
		type: [Object],
		required: true,
	},
	lastUpdated: {
		type: Date,
		required: true,
		default: Date.now(),
	},
});

module.exports = mongoose.model("warnings", warnSchema);
