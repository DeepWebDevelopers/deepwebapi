const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  logChannelID: String,
  logChannelName: String,
});
module.exports = mongoose.model("setlogs_data", schema);
