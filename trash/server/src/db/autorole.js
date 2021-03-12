const mongoose = require("mongoose");
const AutoroleSchema = new mongoose.Schema({
	RoleID: String,
	guildName: String,
	GuildID: String,
});

const MessageModel = (module.exports = mongoose.model(
	"Autorole",
	AutoroleSchema
));
