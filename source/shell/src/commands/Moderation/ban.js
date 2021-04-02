const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const banSchema = require("../../db/ban");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "ban",
			// aliases: [""],
			group: "moderation",
			userPermissions: ["SEND_MESSAGES", "BAN_MEMBERS"],
			clientPermissions: ["SEND_MESSAGES", "BAN_MEMBERS"],
			memberName: "ban_command",
			description: "Bans a member from your server.",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		const member = message.mentions.members.first();

		if (!member) {
			return message.channel
				.send(
					"I cannot find the specified member. Please mention a member in this Discord server."
				)
				.then((m) => m.delete({ timeout: 5000 }));
		}

		const memberId = member.id;
		const memberTag = `${member.user.username}#${member.user.discriminator}`;

		const staff = message.member;
		const staffId = staff.id;
		const staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		if (!member.bannable)
			return message.channel
				.send("This member is not bannable.")
				.then((m) => m.delete({ timeout: 5000 }));

		let reason = args.slice(1).join(" ");

		if (!reason) reason = "No reason provided.";
		if (staff.roles.highest.position < member.roles.highest.position)
			return message.reply(
				`You cannot ban ${memeberTag} due to role hierarchy.`
			);

		try {
			let data = await banSchema.create({
				banId: memberId,
				banTag: memberTag,
				staffId: staffId,
				staffTag,
				staffTag,
				reason: reason,
				guildId: message.guild.id,
				guildName: message.guild.name,
				banDate: Date.now(),
			});

			//? logging
			const Logs = require("../../db/guild/logging");
			var d = new Date(Date.now());
			const guildDB = await Logs.findOne(
				{
					guildID: message.guild.id,
				},
				async (err, guild) => {
					if (err) console.error(err);

					if (!guild) {
						let mongoose = require("mongoose");
						const newLogData = new Logs({
							_id: mongoose.Types.ObjectId(),
							guildID: message.guild.id,
							guildName: message.guild.name,
							logChannelID: null,
							logChannelName: null,
						});

						await newLogData
							.save()
							.then((result) => console.log(result))
							.catch((err) => console.error(err));

						return message.reply(
							`There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
						);
					}
				}
			);

			const modlog = message.guild.channels.cache.get(guildDB.logChannelID);
			if (!modlog) {
				return message
					.reply(
						`Sorry I cant find your mod log channen in my db. Please create one using **${prefix}setlogs** then run this command again!`
					)
					.then((m) => {
						m.delete({ timeout: 5000 });
					});
			}
			const modlogEmbed = new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle("Member banned")
				.setAuthor("Terminal Modlog", message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!")
				.addFields(
					{
						name: "Banned member!",
						value: `${memberTag} (${memberId})`,
					},
					{
						name: "Responsible moderator",
						value: `${staffTag} (${staffId})`,
					},
					{
						name: "Reason for ban",
						value: `${reason}`,
					},
					{
						name: "Date",
						value: `${d.toString()}`,
					}
				);
			modlog.send(modlogEmbed).catch((e) => {
				return;
			});

			message.guild.members.ban(member, {
				reason: reason,
			});

			const success = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setDescription(
					`Successfully banned **${memberTag}** for **${data.reason}** \n\nAction logged in <#${modlog.id}>`
				)
				.setFooter("Thank you for using Terminal!")
				.setTimestamp();
			message.channel.send(success);
		} catch (err) {
			console.log(err);
			// message.channel.send(`An error occurred: \`${err.message}\``);
			return;
		}
	}
};
