const mongoose = require("mongoose");

const REASON = {
  type: String,
  required: false,
};

const USER = {
  type: Number,
  required: true,
};

const DATE = {
  type: String,
  required: true,
};

const USERNAME = {
  type: String,
  required: false,
};

let Schema = new mongoose.Schema({
  userID: USER,
  userName: USERNAME,
  reason: REASON,
  date: DATE,
});

module.exports = mongoose.model("blacklist_users", Schema);
