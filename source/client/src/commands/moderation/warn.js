const mongo = require("../../mongo");
const warnSchema = require("../../db/warn");
const Discord = require("discord.js");

module.exports = {
	name: "warn",
	minArgs: 1,
	maxArgs: -1,
	cooldown: "15s",
	requiredPermissions: ["KICK_MEMBERS"],
	expectedArgs: "<mention> [reason]",
	description: "Give a warning to a user",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		// let modlog = message.guild.channels.cache.find((channel) => {
		// 	return channel.name && channel.name.includes("t-modlog");
		// });

		let target = message.mentions.members.first();
		let targetId = target.id;
		let targetTag = `${target.user.username}#${target.user.discriminator}`;

		if (targetId === client.user.id)
			return message.reply("You cannot warn me.");
		if (targetId === message.author.id)
			return message.reply("You cannot warn yourself.");

		let staff = message.member;
		let staffId = staff.id;
		let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");

		// if (!modlog)
		// 	message.channel.send(
		// 		`Could not find channel **t-modlog**, please install the required values using \`${prefix}setup\` as it is HIGHLY recommended.`
		// 	);
		if (!reason) reason = "No reason provided.";
		if (staff.roles.highest.position < target.roles.highest.position)
			return message.reply(
				`You cannot warn ${targetTag} due to role hierarchy.`
			);

		await mongo().then(async (mongoose) => {
			try {
				let data = await warnSchema.findOne({
					warnId: targetId,
					guildId: message.guild.id,
				});

				if (!data) {
					let newData = await warnSchema.create({
						warnId: targetId,
						warnTag: targetTag,
						guildId: message.guild.id,
						guildName: message.guild.name,
						warnings: [Object],
						lastUpdated: Date.now(),
					});

					data = newData;
				}

				let warning = {
					warnDate: Date.now(),
					staffId: staffId,
					staffTag: staffTag,
					reason: reason,
					warnId: targetId,
				};

				let newWarn = await warnSchema.findOneAndUpdate(
					{
						warnId: targetId,
						guildId: message.guild.id,
					},
					{
						warnId: targetId,
						guildId: message.guild.id,
						lastUpdated: Date.now(),
						$push: {
							warnings: warning,
						},
					},
					{
						upsert: true,
					}
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
							return message.reply(
								`There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
							);
						}
					}
				);
				const modlog = message.guild.channels.cache.get(guildDB.logChannelID);

				const DMEmbed = new Discord.MessageEmbed()
					.setColor("PINK")
					.setTitle(`You have been warned in ${data.guildName}`)
					.setAuthor(
						"Automated Terminal message",
						message.client.user.avatarURL()
					)
					.setTimestamp()
					.setFooter("Shoulda followed the rules... :/")
					.addFields(
						{
							name: "Moderator",
							value: staffTag,
						},
						{
							name: "Reason",
							value: reason,
						},
						{
							name: "Date",
							value: newWarn.lastUpdated.toLocaleString(),
						}
					);

				target
					.createDM()
					.then((DM) => {
						DM.send(DMEmbed).then(() => {
							const success = new Discord.MessageEmbed()
								.setColor("PINK")
								.setDescription(
									`Successfully warned **${newWarn.warnTag}** for **${warning.reason}**`
								)
								.setFooter("Thank you for using Terminal!")
								.setTimestamp();
							message.channel.send(success).catch((err) => {
								return;
							});

							const modlogEmbed = new Discord.MessageEmbed()
								.setColor("YELLOW")
								.setTitle("Member warned")
								.setAuthor("Terminal Modlog", message.client.user.avatarURL())
								.setTimestamp()
								.setFooter("Thank you for using Terminal!")
								.addFields(
									{
										name: "Warned member",
										value: `${targetTag} (${targetId})`,
									},
									{
										name: "Responsible moderator",
										value: `${staffTag} (${staffId})`,
									},
									{
										name: "Reason",
										value: `${reason}`,
									},
									{
										name: "Date",
										value: `${newWarn.lastUpdated.toLocaleString()}`,
									}
								);
							modlog.send(modlogEmbed).catch((e) => {
								return;
							});
						});
					})
					.catch((e) => {
						return; // Catching err if user has their dms off.
					});
			} catch (err) {
				console.log(err);
				message.channel.send(`An error occurred: \`${err.message}\``);
			}
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
// 		//embed

// 		modlog.send(modlogEmbed).catch((e) => {
// 			return;
// 		});
// 	} catch (err) {
// 		console.log(err);
// 		message.channel.send(`An error occurred: \`${err.message}\``);
// 	}
// });
