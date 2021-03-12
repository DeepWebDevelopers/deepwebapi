const commando = require("discord.js-commando");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const autorole = require("../../db/autorole");
const verifySettings = require("../../db/guildVer");

module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "reset",
			group: "admin",
			memberName: "reset-command-settings",
			description: "..",
			userPermissions: ["ADMINISTRATOR"],
			clientPermissions: [
				"ADMINISTRATOR",
				"MANAGE_CHANNELS",
				"MANAGE_ROLES",
				"MANAGE_GUILD",
			],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		const prefix = message.guild.commandPrefix;
		if (!args[0]) {
			let argsembed = new Discord.MessageEmbed()
				.setTitle("Data Resets")
				.setDescription(
					`Use one of the commands to reset data of your choice
            \`${prefix}reset ver\` Resets all your verification settings.
            \`${prefix}reset autorole\` Resets the autorole settings.`
				)
				.setColor("#c28ada");
			message.channel.send(argsembed);
		} else if (message.author.bot || message.channel.type === "dm") {
			return;
		}
		let messageinfocontent = message.content.toLowerCase();
		switch (args[0]) {
			case "ver":
				verifySettings.deleteOne({ GuildID: message.guild.id }, (err) =>
					console.log(err)
				);
				let verifyembed = new Discord.MessageEmbed()
					.setTitle("Data Reset")
					.setDescription("Your verification data has been deleted.")
					.setColor("GREEN");
				message.channel.send(verifyembed);
				break;

			case "autorole":
				autorole.deleteOne({ GuildID: message.guild.id }, (err) =>
					console.log(err)
				);
				let autoroleembed = new Discord.MessageEmbed()
					.setTitle("Data Reset")
					.setDescription("Your autorole data has been deleted.")
					.setColor("RED");
				message.channel.send(autoroleembed);
				break;
		}
	}
};
