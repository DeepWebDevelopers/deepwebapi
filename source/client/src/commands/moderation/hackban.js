const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "hackban",
	aliases: ["cheatban"],
	minArgs: 1,
	maxArgs: -1,
	cooldown: "15s",
	permissions: ["MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS"],
	description: "Updates the channel slowmode.",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const userID = args[0];

		const reason = args.slice(1).join(" ");

		if (!userID) return message.channel.send("Please insert a valid user ID.");

		if (isNaN(userID)) return message.channel.send("User ID must be a number.");

		if (userID === message.author.id)
			return message.channel.send(
				"I should really ban you for trying to ban yourself you dummy!"
			);

		if (userID === message.client.user.id)
			return message.channel.send("You can't ban me stupid!");

		if (!reason) reason = "No reason provided";

		const mongo = require("../../mongo");
		await mongo().then(async (mongoose) => {
			try {
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
								`There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
							);
						}
					}
				);
				const modlog = message.guild.channels.cache.get(guildDB.logChannelID);
				const Discord = require("discord.js");
				const modlogEmbed = new Discord.MessageEmbed()
					.setColor("GOLD")
					.setTitle("")
					.setAuthor("Terminal Modlog", message.client.user.avatarURL())
					.setTimestamp()
					.setFooter("Thank you for using Terminal!")
					.addFields(
						{
							name: "Member Hack banned!",
							value: `${userID} (${user.tag})`,
						},
						{
							name: "Responsible moderator",
							value: `${message.author.tag} (${message.author.id})`,
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
					return console.log(e);
				});
			} catch (err) {
				console.log(err);
				// message.channel.send(`An error occurred: \`${err.message}\``);
			}
		});

		message.client.users
			.fetch(userID)
			.then(async (user) => {
				await message.guild.members.ban(user.id, { reason: reason });

				const embed = new MessageEmbed()
					.setColor("RANDOM")
					.setTitle("Hack Ban!")
					.setDescription(
						`**${user.tag}** has been banned, from outside this server.`
					)
					.addField("Reason for ban:", reason)
					.setFooter(`User was banned by ${message.author.tag}`);
				return message.channel.send(embed);
			})
			.catch((error) => {
				// If the user is unavailable, return some errors. (Recommended)

				return message.channel.send(`An error occurred: **${error}**`);
			});
	},
};
// const mongo = require("../../mongo");
// await mongo().then(async (mongoose) => {
// 	try {
// 		//? logging
// 		const Logs = require("../../db/guild/logging");
// 		var d = new Date(Date.now());
// 		const guildDB = await Logs.findOne(
// 			{
// 				guildID: message.guild.id,
// 			},
// 			async (err, guild) => {
// 				if (err) console.error(err);

// 				if (!guild) {
// 					return message.reply(
// 						`There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
// 					);
// 				}
// 			}
// 		);
// 		const modlog = message.guild.channels.cache.get(guildDB.logChannelID);

// 		const modlogEmbed = new Discord.MessageEmbed()
// 			.setColor("RANDOM")
// 			.setTitle("")
// 			.setAuthor("Terminal Modlog", message.client.user.avatarURL())
// 			.setTimestamp()
// 			.setFooter("Thank you for using Terminal!")
// 			.addFields(
// 				{
// 					name: "Action",
// 					value: `${targetTag} (${targetId})`,
// 				},
// 				{
// 					name: "Responsible moderator",
// 					value: `${staffTag} (${staffId})`,
// 				},
// 				{
// 					name: "Reason for ban",
// 					value: `${reason}`,
// 				},
// 				{
// 					name: "Date",
// 					value: `${d.toString()}`,
// 				}
// 			);
// 		modlog.send(modlogEmbed).catch((e) => {
// 			return;
// 		});

// 	} catch (err) {
// 		console.log(err);
// 		message.channel.send(`An error occurred: \`${err.message}\``);
// 	}
// });
