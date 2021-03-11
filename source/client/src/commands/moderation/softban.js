const Discord = require("discord.js");

module.exports = {
	name: "softban",
	requiredPermissions: ["BAN_MEMBERS"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<user mention> [reason]",
	description: "soft-bans a member from the server.",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!message.guild.me.hasPermission("BAN_MEMBERS"))
			return message.channel.send(
				"**I Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**"
			);
		message.channel.send("Command coming soon.");
	},
};
