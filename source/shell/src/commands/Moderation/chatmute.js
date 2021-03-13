const Discord = require("discord.js");
const muteSchema = require("../../db/chatmute");
const muterole = require("../../db/guild/muterole");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "mute",
			aliases: ["chatmute", "cmute"],
			group: "moderation",
			userPermissions: ["SEND_MESSAGES", "MUTE_MEMBERS", "MANAGE_ROLES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_ROLES"],
			memberName: "mute_command",
			description: "Adds the mute role to a user.",
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
		if (!message.guild.me.hasPermission("MANAGE_ROLES"))
			return message.channel.send(
				"**I Dont Have The Permissions To mute Users! - [MANAGE_ROLES]**"
			);

		if (!args[0])
			return message.reply("Dont be stupid and try to mute nothing!");
		const member = message.mentions.members.first();

		var memberId = member.id;
		let memberTag = `${member.user.username}#${member.user.discriminator}`;

		if (memberId === message.client.user.id)
			return message.reply("You cannot mute me using me.");
		if (memberId === message.author.id)
			return message.reply("You cannot mute yourself.");
		if (member.user.bot)
			return message.reply("Target is a bot, failed to mute.");

		let staff = message.member;
		let staffId = staff.id;
		let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");

		if (!reason) reason = "No reason provided.";
		if (staff.roles.highest.position < member.roles.highest.position)
			return message.reply(
				`You cannot mute ${memberTag} due to role hierarchy. Make sure to mute role is under yours ;)`
			);

		try {
			let data = await muteSchema.create({
				muteId: memberId,
				muteTag: memberTag,
				staffId: staffId,
				staffTag: staffTag,
				reason: reason,
				guildId: message.guild.id,
				guildName: message.guild.name,
				muteDate: Date.now(),
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

			muterole.findOne({ guildID: message.guild.id }, async (err, data432) => {
				if (!data432) {
					return message.reply(
						"No mute role found in this guild. Please run `setmute` to use this command."
					);
				}
				try {
					let rrole = message.guild.roles.cache.get(data432.roleID);

					if (member.roles.cache.has(rrole.id)) {
						return message.channel.send(
							`Target ${memberTag} already has <@${data432.roleID}> assigned.`
						);
					} else {
						const success = new Discord.MessageEmbed()
							.setColor("RANDOM")
							.setDescription(
								`Successfully muted **${data.muteTag}** from chatting for **${data.reason}** \n\nAction logged in <#${modlog.id}>`
							)
							.setFooter("Thank you for using Terminal!")
							.setTimestamp();
						message.channel.send(success);

						const modlogEmbed = new Discord.MessageEmbed()
							.setColor("BLUE")
							.setTitle("Member Muted")
							.setAuthor("Terminal Modlog", message.client.user.avatarURL())
							.setTimestamp()
							.setFooter("Thank you for using Terminal!")
							.addFields(
								{
									name: "Muted member!",
									value: `${memberTag} (${memberId})`,
								},
								{
									name: "Responsible moderator",
									value: `${staffTag} (${staffId})`,
								},
								{
									name: "Reason for mute",
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
					}

					member.roles.add(rrole).catch((err) => {
						console.log(err);
						return message.repy(
							"There was an error adding the role to the member."
						);
					});
				} catch (err) {
					console.log(err);
					return;
				}
			});
		} catch (err) {
			console.log(err);
			message.channel.send(`An error occurred: \`${err.message}\``);
		}
	}
};
