const mongoose = require("mongoose");

const stringOpt = {
  type: String,
  required: true,
};

const guildSchama = mongoose.Schema({
  staffRole: String,
  logsChannel: String,
  guildID: stringOpt,
  guildName: stringOpt,
  VerifiedRoleID: String,
  VerifyChannelID: String,
});

module.exports = mongoose.model("guild-settings-dev", guildSchama);
