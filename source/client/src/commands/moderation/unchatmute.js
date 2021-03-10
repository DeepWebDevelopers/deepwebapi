const Discord = require("discord.js");
const mongo = require("../../mongo");
const muteSchema = require("../../db/chatmute");
const Logs = require("../../db/guild/logging");
const muterole = require("../../db/guild/muterole");
var d = new Date(Date.now());

module.exports = {
	name: "unchatmute",
	aliases: ["ucm", "unmute"],
	requiredPermissions: ["MANAGE_ROLES"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<mention> [reason]",
	description: "Allow user to chat in channels",
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
		targetTag = `${target.user.username}#${target.user.discriminator}`;

		if (targetId === client.user.id)
			return message.reply("Did you really just try to unmute me...using me?");
		if (targetId === message.author.id)
			return message.reply("You cannot unmute yourself.");
		if (target.user.bot)
			return message.reply("Target is a bot, failed to unmute.");

		let staff = message.member;
		let staffId = staff.id;
		let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");

		if (!reason) reason = "No reason provided.";
		if (staff.roles.highest.position < target.roles.highest.position)
			return message.reply(
				`You cannot unmute ${targetTag} due to role hierarchy.`
			);

		await mongo().then(async (mongoose) => {
			try {
				let data = await muteSchema.findOneAndDelete({
					muteId: targetId,
					guildId: message.guild.id,
				});

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

							const success = new Discord.MessageEmbed()
								.setColor("RANDOM")
								.setDescription(
									`Successfully unmuted **${data.muteTag}** from chatting for **${reason}**`
								)
								.setFooter("Thank you for using Terminal!")
								.setTimestamp();
							message.channel.send(success);
							const modlogEmbed = new Discord.MessageEmbed()
								.setColor("GREEN")
								.setTitle("Member UnMuted")
								.setAuthor("Terminal Modlog", message.client.user.avatarURL())
								.setTimestamp()
								.setFooter("Thank you for using Terminal!")
								.addFields(
									{
										name: "Unmuted member",
										value: `${targetTag} (${targetId})`,
									},
									{
										name: "Responsible moderator",
										value: `${staffTag} (${staffId})`,
									},
									{
										name: "Reason for unmute",
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
							target.roles.remove(rrole).catch((err) => {
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

/** //! Mute system without log channel db (working)
 * let modlog = message.guild.channels.cache.find((channel) => {
			return channel.name && channel.name.includes("t-modlog");
		});
		let role = message.guild.roles.cache.find((role) => {
			return role.name === "muted";
		});

		let target = message.mentions.members.first();
		let targetId = target.id;
		let targetTag = `${target.user.username}#${target.user.discriminator}`;

		if (targetId === client.user.id)
			return message.reply("You cannot mute me using me.");
		if (targetId === message.author.id)
			return message.reply("You cannot mute yourself.");
		if (target.user.bot)
			return message.reply("Target is a bot, failed to unmute.");

		let staff = message.member;
		let staffId = staff.id;
		let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");

		if (!modlog)
			message.channel.send(
				`Could not find channel **t-modlog**, please install the required values using \`${prefix}setup\` as it is HIGHLY recommended.`
			);
		if (!role)
			return message.channel.send(
				`Could not find role **muted**, please install the required values using \`${prefix}setup\`.`
			);
		if (!target.roles.cache.has(role.id))
			return message.channel.send(
				`Target ${targetTag} already does not have role **muted** assigned.`
			);
		if (!reason) reason = "No reason provided.";
		if (staff.roles.highest.position < target.roles.highest.position)
			return message.reply(
				`You cannot unmute ${targetTag} due to role hierarchy.`
			);

		await mongo().then(async (mongoose) => {
			try {
				let data = await muteSchema.findOneAndDelete({
					muteId: targetId,
					guildId: message.guild.id,
				});

				target.roles.remove(role);

				const success = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setDescription(
						`Successfully unmuted **${data.muteTag}** from chatting for **${reason}**`
					)
					.setFooter("Thank you for using Terminal!")
					.setTimestamp();
				message.channel.send(success);
				const modlogEmbed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle("Member UnMuted")
					.setAuthor("Terminal Modlog", message.client.user.avatarURL())
					.setTimestamp()
					.setFooter("Thank you for using Terminal!")
					.addFields(
						{
							name: "Unmuted member",
							value: `${targetTag} (${targetId})`,
						},
						{
							name: "Responsible moderator",
							value: `${staffTag} (${staffId})`,
						},
						{
							name: "Reason for unmute",
							value: `${reason}`,
						},
						{
							name: "Date",
							value: `${Date.now().toLocaleString()}`,
						}
					);
				modlog.send(modlogEmbed).catch((e) => {
					return;
				});
			} catch (err) {
				console.log(err);
				message.channel.send(`An error occurred: \`${err.message}\``);
			}
		});
 */
