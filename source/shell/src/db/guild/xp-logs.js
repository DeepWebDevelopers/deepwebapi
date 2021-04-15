const mongoose = require("mongoose");

const GUILDID = {
  type: Number,
  required: true,
};
const GUILDNAME = {
  type: String,
  required: false,
};
const XPCHANNEL = {
  type: Number,
  required: false,
};

const schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildName: GUILDNAME,
  guildID: GUILDID,
  xpChannel: XPCHANNEL,
});
module.exports = mongoose.model("xp-logs", schema);
