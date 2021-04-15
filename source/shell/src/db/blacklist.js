const mongoose = require("mongoose");

const SETTINGS = {
  type: String,
  required: true,
};

let Schema = new mongoose.Schema({
  userID: SETTINGS,
  userName: String,
});

module.exports = mongoose.model("blacklist_users", Schema);
