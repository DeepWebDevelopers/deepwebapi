const nickSchema = require("../../db/nicknames");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "nickname",
			aliases: ["nick", "changenickname"],
			group: "moderation",
			userPermissions: ["SEND_MESSAGES", "MANAGE_NICKNAMES"],
			clientPermissions: [
				"SEND_MESSAGES",
				"VIEW_CHANNEL",
				"VIEW_AUDIT_LOG",
				"MANAGE_NICKNAMES",
			],
			memberName: "nickname_command",
			description: "See past user nicknames",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 45,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		let target = message.mentions.members.first() || message.member;
		let targetId = target.id;
		let targetTag = `${target.user.username}#${target.user.discriminator}`;

		let staff = message.member;

		try {
			let data = await nickSchema.findOne({
				userId: targetId,
				guildId: message.guild.id,
			});

			if (!data) {
				let newData = await nickSchema.create({
					userId: targetId,
					userTag: targetTag,
					guildId: message.guild.id,
					guildName: message.guild.name,
					nicknames: [Object],
					lastUpdated: Date.now(),
				});

				data = newData;
			}

			let str = `**Current nickname:** ${target.displayName}\n\n`;
			data.nicknames.forEach((nickname) => {
				str += `**${nickname.name}**, changed by ${nickname.moderator}\n`;
			});

			const embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle(`Previous nicknames for ${targetTag}`)
				.setDescription(str)
				.setAuthor(
					message.author.tag,
					message.author.avatarURL({
						format: "png",
					})
				)
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter(
					`Requested by ${staff.user.username}#${staff.user.discriminator}`
				);

			message.channel.send(embed);
		} catch (err) {
			console.log(err);
			message.channel.send("An error occurred: " + err.message);
		}
	}
};
