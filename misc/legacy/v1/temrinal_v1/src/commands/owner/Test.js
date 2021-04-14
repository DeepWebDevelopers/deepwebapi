const Discord = require("discord.js");
module.exports = {
	name: "test",
	minArgs: 0,
	maxArgs: 0,
	guildOnly: true,
	testOnly: true,
	ownerOnly: true,
	permissions: ["SEND_MESSAGES"],
	description: "Ranomd Test Command",
	category: "Bot Owner",
	run: async ({ message, args, text, client, prefix, instance }) => {
		message.channel.send(
			`Server prefix: **${prefix}**, Ready to run commands!`
		);
	},
};
