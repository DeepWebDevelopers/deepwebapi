const Discord = require("discord.js");
const db = require("../../db/blacklist");
const mongo = require("../../mongo");

module.exports = {
	name: "blacklist",
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<user id>",
	description: "Run a child process in Discord",
	category: "Bot Owner",
	// testOnly: true,
	ownerOnly: true,
	run: async ({ message, args, text, client, prefix, instance }) => {
		message.reply("comming soon...");
	},
};
