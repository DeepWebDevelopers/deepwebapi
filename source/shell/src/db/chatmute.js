const mongoose = require("mongoose");

const stringOpt = {
  type: String,
  required: true,
};

const muteSchama = mongoose.Schema({
  muteId: stringOpt,
  muteTag: stringOpt,
  staffId: stringOpt,
  staffTag: stringOpt,
  reason: stringOpt,
  guildId: stringOpt,
  guildName: stringOpt,
  muteDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  unmuteDate: {
    type: Date,
  },
});

module.exports = mongoose.model("chat-mutes", muteSchama);
