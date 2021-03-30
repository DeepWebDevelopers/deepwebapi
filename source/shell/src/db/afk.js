const mongoose = require("mongoose");

const afkOptString = {
	type: String,
	required: true,
};

const afkOptNumber = {
	type: Number,
	required: false,
};

const afkOptBoolean = {
	type: Boolean,
	required: true,
};

const Schema = new mongoose.Schema({
	id: afkOptString,
	isafk: afkOptBoolean,
	reason: afkOptString,
	timeAfk: afkOptNumber,
});
module.exports = mongoose.model("afk", Schema);
