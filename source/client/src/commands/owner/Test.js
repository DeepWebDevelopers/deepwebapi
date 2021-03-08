const Discord = require("discord.js");
module.exports = {
	name: "ping",
	commands: ["runping"],
	minArgs: 0,
	maxArgs: 0,
	guildOnly: true,
	testOnly: true,
	ownerOnly: true,
	permissions: ["SEND_MESSAGES"],
	description: "Fetch latency",
	category: "Information",
	run: async ({ message }) => {
		
	},
};
