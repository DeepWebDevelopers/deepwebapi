const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	GuildID: String,
	guildName: String,
	logChannelID: String,
	StaffRole: String,
});

module.exports = mongoose.model("Guild-data", guildSchema, "Main-Guild-Data");
