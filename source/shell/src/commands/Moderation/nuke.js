const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "nuke",
			aliases: ["channelnuke", "channuk"],
			group: "moderation",
			userPermissions: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_CHANNELS"],
			memberName: "channel_nuke_command",
			description: "nukes the current channel!",
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

		if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
			return message.channel.send(
				"**I Dont Have The Permissions To Delete Channels! - [MANAGE_CHANNELS]**"
			);
		const msg = await message.channel.send(
			"Are you sure you want to nuke this channel? This Action cannot be undone!"
		);
		await msg.react("✅");
		await msg.react("❌");
		const filter = (reaction, user) => {
			return (
				(reaction.emoji.name === "✅" || reaction.emoji.name === "❌") &&
				user.id === message.author.id
			);
		};

		msg
			.awaitReactions(filter, {
				max: 1,
				time: 60000,
				errors: ["time"],
			})
			.then(async (reaction) => {
				if (reaction.first().emoji.name === "✅") {
					await message.channel.send("**TACTICAL NUKE INCOMING!**"); // this is optional, you can delete this if you want
					let channel = message.guild.channels.cache.get(message.channel.id); // get the channel to nuke (basically the channel the command was sent in)
					var position = channel.position; // We need the channel permission to we can move the cloned channel to where the original channel was.

					channel.clone().then(async (channel2) => {
						// clones the channel, we define this channel as 'channel2' in a 'then' statement
						await channel2.setPosition(position); // this is where we used the position variable
						await channel.delete(); // now that we put the cloned channel where need it to be, we can delete the original
						await channel2.send("**NUKED CHANNEL SUCCESSFULLY**"); // sends a message to confirm that it was able to nuke it
						await channel2.send(
							"https://giphy.com/gifs/80s-akira-oQtO6wKK2q0c8"
						); // sends an anime nuke gif

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
									}
								}
							);

							const modlog = message.guild.channels.cache.get(
								guildDB.logChannelID
							);
							if (!modlog) {
								return;
							}

							let modlogEmbed = new Discord.MessageEmbed()
								.setTitle("A Channel has been Nuked!")
								.setAuthor("Terminal Modlog", message.client.user.avatarURL())
								.setAuthor("Terminal Modlog", message.client.user.avatarURL())
								.addFields(
									{
										name: "New Channel created:",
										value: `Name: ${channel2}`,
									},
									{
										name: "Nuked by:",
										value: `Name: ${message.author.tag} (${message.author.id})`,
									},
									{ name: "Time", value: `Action date: ${d}` }
								)
								.setTimestamp()
								.setColor("RED");

							modlog.send(modlogEmbed).catch((err) => {
								return console.log(err);
							});
						} catch (err) {
							console.log(err);
							message.channel.send(`An error occurred: \`${err.message}\``);
						}
					});
				} else if (reaction.first().emoji.name === "❌") {
					const embed = new Discord.MessageEmbed()
						.setDescription(
							`Command has been canceled by ${message.author.tag}`
						)
						.setColor("GREEN")
						.setTimestamp();
					message.channel.send(embed);
				}
			})
			.catch(() => {
				const embed = new Discord.MessageEmbed()
					.setTitle(`Error Detected`)
					.setDescription(
						`:no_entry: You Have Ran Out Of Time To Respond. Please Try Again. :no_entry:`
					)
					.setColor(`RED`);
				return message.channel.send(embed);
			});
	}
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
// 		let modlogEmbed = new Discord.MessageEmbed()
// 	.setTitle("A Channel has been Nuked!")
// 	.addFields(
// 		{ name: "Channel nuked:", value: `Name: ${channel}` },
// 		{
// 			name: "New Channel created:",
// 			value: `Name: ${channel2}`,
// 		},
// 		{
// 			name: "Ran by:",
// 			value: `Name: ${message.author.tag} (${message.author.id})`,
// 		},
// 		{ name: "Time", value: `Action date:${d}` }
// 	)
// 	.setTimestamp();

// modlog.send(modlogEmbed).catch((e) => {
// 	return;
// });

// 	} catch (err) {
// 		console.log(err);
// 		message.channel.send(`An error occurred: \`${err.message}\``);
// 	}
// });

/**
 * if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
			return message.channel.send(
				"**I Dont Have The Permissions To Delete Channels! - [MANAGE_CHANNELS]**"
			);
		const msg = await message.channel.send(
			"Are you sure you want to nuke this channel? This Action cannot be undone!"
		);
		await msg.react("✅");
		await msg.react("❌");
		const filter = (reaction, user) => {
			return (
				(reaction.emoji.name === "✅" || reaction.emoji.name === "❌") &&
				user.id === message.author.id
			);
		};

		msg
			.awaitReactions(filter, {
				max: 1,
				time: 60000,
				errors: ["time"],
			})
			.then(async (reaction) => {
				if (reaction.first().emoji.name === "✅") {
					await message.channel.send("**TACTICAL NUKE INCOMING!**"); // this is optional, you can delete this if you want
					let channel = message.guild.channels.cache.get(message.channel.id); // get the channel to nuke (basically the channel the command was sent in)
					var position = channel.position; // We need the channel permission to we can move the cloned channel to where the original channel was.

					channel.clone().then((channel2) => {
						// clones the channel, we define this channel as 'channel2' in a 'then' statement
						channel2.setPosition(position); // this is where we used the position variable
						channel.delete(); // now that we put the cloned channel where need it to be, we can delete the original
						channel2.send("**NUKED CHANNEL SUCCESSFULLY**"); // sends a message to confirm that it was able to nuke it
						channel2.send("https://giphy.com/gifs/80s-akira-oQtO6wKK2q0c8"); // sends an anime nuke gif

						const mongo = require("../../mongo");
						mongo().then(async (mongoose) => {
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

								const modlog = message.guild.channels.cache.get(
									guildDB.logChannelID
								);

								// try {
								// 	if(!moglog) return
								// } catch {}

								let modlogEmbed = new Discord.MessageEmbed()
									.setTitle("A Channel has been Nuked!")
									.setAuthor("Terminal Modlog", message.client.user.avatarURL())
									.setAuthor("Terminal Modlog", message.client.user.avatarURL())
									.addFields(
										{
											name: "New Channel created:",
											value: `Name: ${channel2}`,
										},
										{
											name: "Ran by:",
											value: `Name: ${message.author.tag} (${message.author.id})`,
										},
										{ name: "Time", value: `Action date: ${d}` }
									)
									.setTimestamp()
									.setColor("RED");

								modlog.send(modlogEmbed).catch((err) => {
									return console.log(err);
								});
							} catch (err) {
								console.log(err);
								message.channel.send(`An error occurred: \`${err.message}\``);
							}
						});
					});
				} else if (reaction.first().emoji.name === "❌") {
					const embed = new Discord.MessageEmbed()
						.setDescription(
							`Command has been canceled by ${message.author.tag}`
						)
						.setColor("GREEN")
						.setTimestamp();
					message.channel.send(embed);
				}
			})
			.catch(() => {
				const embed = new Discord.MessageEmbed()
					.setTitle(`Error Detected`)
					.setDescription(
						`:no_entry: You Have Ran Out Of Time To Respond. Please Try Again. :no_entry:`
					)
					.setColor(`RED`);
				return message.channel.send(embed);
			});
 */
