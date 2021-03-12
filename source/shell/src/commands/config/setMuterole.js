const Discord = require("discord.js");
const commando = require("discord.js-commando");
const muterole = require("../../db/guild/muterole");
const mongoose = require("mongoose");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "setmute",
			aliases: ["setmuterole"],
			group: "config",
			userPermissions: ["SEND_MESSAGES", "MANAGE_ROLES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "set_mute_role_command",
			description: "Sets the bots mute role for your server.",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;
		if (!message.member.hasPermission("ADMINISTRATOR")) {
			return message.channel.send(
				"You don't have permission to use this command."
			);
		}
		let role =
			message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
		if (!role) {
			const embed = new Discord.MessageEmbed()
				.setTitle("Muterole Support")
				.setTimestamp()
				.setColor("RED")
				.setFooter(
					`Bot Powered by ThatGuyJamal#2695`,
					message.author.displayAvatarURL()
				)
				.setDescription("You did not enter a role.!")
				.addField("Usage:", "`muterole <role>`");
			return message.channel
				.send(embed)
				.catch(() => message.reply("Could not find the role"));
		}
		muterole.findOne({ guildID: message.guild.id }, async (err, data) => {
			if (err) console.log(err);
			if (data) {
				let exists = new Discord.MessageEmbed()
					.setTitle("Data Already Exists")
					.setDescription(
						`Please use the \`${prefix}reset\` command to reset your data.`
					)
					.setColor("RED");
				return message.channel.send(exists);
			}
			if (!data) {
				let newRole = new muterole({
					_id: mongoose.Types.ObjectId(),
					guildID: message.guild.id,
					roleID: role.id,
					roleName: role.name,
					guildName: message.guild.name,
				});
				newRole.save();
				let success = new Discord.MessageEmbed()
					.setTitle("Data Created")
					.setDescription(`The mute roll has been set to: ${role.toString()}.`)
					.setColor("GREEN")
					.setFooter(`To reset the data run ${prefix}reset`);
				message.channel.send(success);
			} else {
				let exists = new Discord.MessageEmbed()
					.setTitle("Data Already Exists")
					.setDescription(
						`Please use the \`${prefix}reset\` command to reset your data.`
					)
					.setColor("RED");
				message.channel.send(exists);
			}
		});
	}
};
