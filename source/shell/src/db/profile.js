const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
    default: "Unemployed",
  },
  bank: {
    type: Number,
    required: true,
    default: 0,
  },
  wallet: {
    type: Number,
    required: true,
    default: 0,
  },
  multiplier: {
    type: Number,
    required: true,
    default: 1,
  },
  inventory: {
    type: [Object],
    required: true,
  },
  dailyCooldown: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  workCooldown: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  weeklyCooldown: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  monthlyCooldown: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  hourlyCooldown: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  begCooldown: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  robCooldown: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  bankRobCooldown: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("profiles", profileSchema);
