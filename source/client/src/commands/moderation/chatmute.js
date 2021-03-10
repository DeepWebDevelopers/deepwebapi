const Discord = require("discord.js");
const mongo = require("../../mongo");
const muteSchema = require("../../db/chatmute");
const muterole = require("../../db/guild/muterole");

module.exports = {
	name: "chatmute",
	aliases: ["cm", "mute"],
	requiredPermissions: ["MANAGE_ROLES"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<mention> [reason]",
	description: "Prevent user from chatting in channels",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let target = message.mentions.members.first();

		try {
			var targetId = target.id;
		} catch {
			return message.reply(
				"Cant find that user. Make sure there in the server."
			);
		}

		var targetId = target.id;
		let targetTag = `${target.user.username}#${target.user.discriminator}`;

		if (targetId === client.user.id)
			return message.reply("You cannot mute me using me.");
		if (targetId === message.author.id)
			return message.reply("You cannot mute yourself.");
		if (target.user.bot)
			return message.reply("Target is a bot, failed to mute.");

		let staff = message.member;
		let staffId = staff.id;
		let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");

		if (!reason) reason = "No reason provided.";
		if (staff.roles.highest.position < target.roles.highest.position)
			return message.reply(
				`You cannot mute ${targetTag} due to role hierarchy. Make sure to mute role is under yours ;)`
			);

		await mongo().then(async (mongoose) => {
			try {
				let data = await muteSchema.create({
					muteId: targetId,
					muteTag: targetTag,
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
							return message.reply(
								"There is no modlog system setup for Terminal. Please set one up for my command functions. Run: `setlogs`"
							);
						}
					}
				);
				const modlog = message.guild.channels.cache.get(guildDB.logChannelID);

				muterole.findOne(
					{ guildID: message.guild.id },
					async (err, data432) => {
						if (!data432) {
							return message.reply(
								"No mute role found in this guild. Please run `setmute` to use this command."
							);
						}
						try {
							let rrole = message.guild.roles.cache.get(data432.roleID);

							if (target.roles.cache.has(rrole.id)) {
								return message.channel.send(
									`Target ${targetTag} already has ${data432.roleID} assigned.`
								);
							} else {
								const success = new Discord.MessageEmbed()
									.setColor("RANDOM")
									.setDescription(
										`Successfully muted **${data.muteTag}** from chatting for **${data.reason}**`
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
											value: `${targetTag} (${targetId})`,
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

							target.roles.add(rrole).catch((err) => {
								return message.repy(
									"There was an error adding the role to the member."
								);
							});
						} finally {
							return;
						}
					}
				);
			} catch (err) {
				console.log(err);
				// message.channel.send(`An error occurred: \`${err.message}\``);
			}
		});
	},
};
