const commando = require("discord.js-commando");
const Discord = require("discord.js");
const mongoose = require("mongoose");
const verifySettings = require("../../db/guildVer");

module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "verfiy-settings",
			aliases: ["v-settings", "v-set"],
			group: "config",
			memberName: "verify-settings-command",
			description: "..",
			userPermissions: ["MANAGE_GUILD"],
			clientPermissions: ["SEND_MESSAGES"],
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

		let channel = message.mentions.channels.first();
		let role = message.mentions.roles.first();
		let argsEmbed = new Discord.MessageEmbed()
			.setTitle("Not Enough Arguments 😵")
			.setDescription(`❌ Please be more descriptive.`)
			.addField(
				"Example:",
				`\`${prefix}v-settings <channel mention> <role mention>\``
			)
			.setColor("RED")
			.setTimestamp();

		/**
         * if(!message.member.hasPermission("ADMINISTRATOR")) {
        return message.channel.send("❌ You do not have permissions to use this command.")
        }
         */

		if (!channel) {
			return message.channel.send(argsEmbed);
		}

		if (!role) {
			return message.channel.send(argsEmbed);
		}

		verifySettings.findOne({ guildID: message.guild.id }, async (err, data) => {
			if (err) console.log(err);
			if (!data) {
				let newSettings = new verifySettings({
					GuildID: message.guild.id,
					VerifiedRoleID: role.id,
					VerifyChannelID: channel.id,
				});
				let embed = new Discord.MessageEmbed()
					.setTitle("Settings Added")
					.setDescription(
						`The bot will now only accept verification commands coming from ${channel} and the role that will be given is ${role}.`
					)
					.setColor("GREEN");
				newSettings.save();
				message.channel.send(embed);
			} else {
				let existsembed = new Discord.MessageEmbed()
					.setTitle("Data Already Exists")
					.setDescription(
						`To add a verification system, please use \`${prefix}reset\` before using this command.`
					)
					.setColor("RED");
				message.channel.send(existsembed);
			}
		});
	}
};
