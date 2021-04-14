const Discord = require("discord.js");
const mongo = require("../../mongo");
const nickSchema = require("../../db/nicknames");

module.exports = {
	name: "nicknames",
	aliases: ["nicks"],
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: "[mention]",
	description: "View past nicknames of a member",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let target = message.mentions.members.first() || message.member;
		let targetId = target.id;
		let targetTag = `${target.user.username}#${target.user.discriminator}`;

		let staff = message.member;

		await mongo().then(async (mongoose) => {
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
		});
	},
};
