const muteSchema = require("../../db/voicemute");

const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "voicemute",
			aliases: ["vcm", "vcmute"],
			group: "moderation",
			userPermissions: ["SEND_MESSAGES", "MUTE_MEMBERS"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MUTE_MEMBERS"],
			memberName: "voice_mute_command",
			description: "voice mute a member",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 35,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		if (!message.guild.me.hasPermission("MUTE_MEMBERS"))
			return message.channel.send(
				"**I Dont Have The Permissions To mute Users! - [MUTE_MEMBERS]**"
			);
		let member = message.mentions.members.first();
		let memberId = member.id;
		let memberTag = `${member.user.username}#${member.user.discriminator}`;

		if (!member)
			return message.channel.send("You need to mention a valid user.");
		if (memberId === message.client.user.id)
			return message.reply("You cannot mute me using me.");
		if (memberId === message.author.id)
			return message.reply("You cannot mute yourself.");
		if (member.user.bot)
			return message.reply("member is a bot, failed to mute.");

		let staff = message.member;
		let staffId = staff.id;
		let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");

		if (!reason) reason = "No reason provided.";
		if (staff.roles.highest.position < member.roles.highest.position)
			return message.reply(
				`You cannot mute ${memberTag} due to role hierarchy.`
			);

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
			.setColor("GRAY")
			.setTitle("Member Unvoice Muted")
			.setAuthor("Terminal Modlog", message.client.user.avatarURL())
			.setTimestamp()
			.setFooter("Thank you for using Terminal!")
			.addFields(
				{
					name: "Unmuted Voice member!",
					value: `${memberTag} (${memberId})`,
				},
				{
					name: "Responsible moderator",
					value: `${staffTag} (${staffId})`,
				},
				{
					name: "Reason for Unmute",
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

		if (!member.voice.channel)
			return message.reply(`${memberTag} is not connected to a voice channel.`);
		if (member.voice.serverMute)
			return message.reply(`${memberTag} is already server muted.`);

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

			member.voice.setMute(true, reason);

			const success = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setDescription(
					`Successfully voice muted **${data.muteTag}** for **${data.reason}**  \n\nAction logged in <#${modlog.id}>`
				)
				.setFooter("Thank you for using Terminal!")
				.setTimestamp();
			message.channel.send(success);
		} catch (err) {
			console.log(err);
			message.channel.send(`An error occurred: \`${err.message}\``);
		}
	}
};
