const mongoose = require("mongoose");

const stringOpt = {
  type: String,
  required: true,
};

const banSchama = mongoose.Schema({
  banId: stringOpt,
  banTag: stringOpt,
  staffId: stringOpt,
  staffTag: stringOpt,
  reason: stringOpt,
  guildId: stringOpt,
  guildName: stringOpt,
  banDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  unbanDate: {
    type: Date,
  },
});

module.exports = mongoose.model("bans", banSchama);
