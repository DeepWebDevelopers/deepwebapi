const mongoose = require("mongoose");

const UserConfigSchema = new mongoose.Schema({
	userId: {
		required: true,
		type: String,
	},
	guildId: {
		required: true,
		type: String,
	},
	guildName: {
		type: String,
		required: false,
	},
	coins: {
		required: false,
		default: 0,
		type: Number,
	},
	bankSpace: {
		required: false,
		default: 1000,
		type: Number,
	},
	job: {
		required: false,
		type: String,
	},
	coinsInBank: {
		required: false,
		default: 0,
		type: Number,
	},
	daily: {
		required: false,
		default: Date.now() - 1,
		type: Date,
	},
});

module.exports = mongoose.model("economy-data", UserConfigSchema);
