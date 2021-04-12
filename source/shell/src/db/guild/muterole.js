const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  roleID: String,
});
module.exports = mongoose.model("mute-role-data", schema);
