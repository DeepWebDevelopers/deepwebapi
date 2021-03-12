const commando = require("discord.js-commando");
const autorole = require("../../db/autorole");
const Discord = require("discord.js");
const mongoose = require("mongoose");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "set-autorole",
			aliases: ["set-main-role", "autorole", "set-role"],
			group: "admin",
			memberName: "amind-autorole-command",
			description: "..",
			userPermissions: ["MANAGE_GUILD", "MANAGE_ROLES"],
			clientPermissions: ["VIEW_AUDIT_LOG", "MANAGE_ROLES"],
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
		let role =
			message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

		if (!role) {
			const embed = new Discord.MessageEmbed()
				.setTitle("AutoRole Support")
				.setTimestamp()
				.setColor("RED")
				.setFooter(
					`Bot Powered by ThatGuyJamal#2695`,
					message.author.displayAvatarURL()
				)
				.setDescription(
					"`READ ME!` If my bot role is not higher than the role you wish to assign, then this will not work."
				)
				.addField("Usage:", `\`${prefix}autorole <role>\``);
			return message.channel.send(embed);
		}

		/**
     * if(!message.member.hasPermission('ADMINISTRATOR')) {
      return message.channel.send('You don\'t have permission to use this command.')
    }
     */

		/** try {
      if (message.role.roles.highest.position > this.client.roles.highest.position)
            return
    }catch {
      return message.reply('The Bot Role Must be higher than the role you wish to asign for the auto role command. To fix  this err move the bot role higher!').then(m => m.delete({timeout: 15000}));
	} */

		// message.guild.me.roles.highest.position >
		// 	message.member.roles.highest.position;
		if (role) {
			if (
				role === message.member.roles.highest.position &&
				message.guild.me.roles.highest.position > role
			) {
				return message
					.reply("My role must be higher than that role.")
					.catch((err) => {
						message.reply("There has been an error.");
						console.log(err);
					});
			} else {
				message.react("👍").catch((err) => {
					message.reply("There has been an error.");
					console.log(err);
				});
			}
		}

		autorole.findOne({ GuildID: message.guild.id }, async (err, data) => {
			if (err) console.log(err);
			if (!data) {
				let newRole = new autorole({
					GuildID: message.guild.id,
					guildName: message.guild.name,
					RoleID: role.id,
				});
				newRole.save();
				let success = new Discord.MessageEmbed()
					.setTitle("Data Created")
					.setDescription(
						`The role given on join will now be ${role.toString()}.`
					)
					.setColor("GREEN");
				message.channel.send(success);
			} else {
				let exists = new Discord.MessageEmbed()
					.setTitle("Data Already Exists")
					.setDescription(
						`Please use the \`${prefix}reset\` command to reset your data.`
					)
					.setColor("RED");
				await message.channel.send(exists).catch((err) => {
					message.reply("There has been an error.");
					console.log(err);
				});
			}
		});
	}
};
