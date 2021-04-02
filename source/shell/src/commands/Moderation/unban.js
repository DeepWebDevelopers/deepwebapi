const banSchema = require("../../db/ban");
const Guild = require("../../db/guild/logging");
var d = new Date(Date.now());
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "unban",
			// aliases: [""],
			group: "moderation",
			userPermissions: ["SEND_MESSAGES", "BAN_MEMBERS"],
			clientPermissions: [
				"SEND_MESSAGES",
				"VIEW_CHANNEL",
				"BAN_MEMBERS",
				"ADD_REACTIONS",
			],
			memberName: "unban_command",
			description: "Unban a member from your guild",
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

		const nologtext = `There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`;

		if (!message.guild.me.hasPermission("BAN_MEMBERS"))
			return message.channel.send(
				"**I Dont Have The Permissions To UnBan Users! - [BAN_MEMBERS]**"
			);

		if (!args[0]) {
			return message.reply("Why would you unban nothing?");
		}
		const guildDB = await Guild.findOne(
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

		const logChannel = message.guild.channels.cache.get(guildDB.logChannelID);
		if (!logChannel) {
			return message.reply(
				`There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
			);
		}

		try {
			var targetId = args[0];
		} catch (e) {
			console.log(e);
			return message.channel
				.send("❌Not a valid user!")
				.then((m) => m.delete({ timeout: 10000 }));
		}

		const reason = args[1] ? args.slice(1).join(" ") : "No reason was given";

		const embed = new Discord.MessageEmbed().setFooter(
			`${message.author.tag} | ${message.author.id}`,
			message.author.displayAvatarURL({ dynamic: true })
		);

		try {
			const data = await banSchema.findOneAndDelete({
				banId: targetId,
				guildId: message.guild.id,
			});

			if (!data) return;
			message.guild
				.fetchBans()
				.then((bans) => {
					const user = bans.find((ban) => ban.user.id === targetId);

					if (!logChannel) {
						return message.reply(
							"The user was still Unbanned, but you have not set a modlogs channel."
						);
					}

					if (user) {
						let embed = new Discord.MessageEmbed()
							.setTitle(`🔓 Unbanned ${user.user.tag}`)
							.setAuthor("Terminal Modlog", message.client.user.avatarURL())
							.setColor("GREEN")
							.setTimestamp()
							.setFooter(`${d}`)
							.addField("User Tag", user.user.tag, true)
							.addField("User ID", user.user.id, true)
							.addField(
								"Banned Reason",
								user.reason != null
									? user.reason
									: "no reason was given for the unban"
							)
							.addField(
								"User to commit the unban",
								`${message.author.tag} ID:(${message.author.id})`
							)
							.addField("Unbanned Reason", reason);
						message.guild.members
							.unban(user.user.id, reason)
							.then(() => logChannel.send(embed));
						message.channel.send(
							` \n\nAction logged in <#${modlog.id}>`
						);
						message.react("👍");
					} else {
						embed
							.setTitle(`User ${targetId} isn't banned!`)
							.setTimestamp()
							.setColor("#ff0000");
						message.channel.send(embed).then((m) => {
							m.delete({ timeout: 3500 });
						});
					}
				})
				.catch((e) => {
					console.log(e);
					message.channel.send("❌An error has occurred!");
				});
		} catch (err) {
			console.log(err);
			message.channel.send(`An error occurred: \`${err.message}\``);
		}
	}
};

// await mongo().then(async (mongoose) => {
// 	try {
// 		let data = await banSchema.findOneAndDelete({
// 			banId: targetId,
// 			guildId: message.guild.id,
// 		});

// 		message.guild.members.unban(target);

// 		const success = new Discord.MessageEmbed()
// 			.setColor("RANDOM")
// 			.setDescription(
// 				`Successfully unbanned **${targetTag}** for **${reason}**`
// 			)
// 			.setFooter("Thank you for using Terminal!")
// 			.setTimestamp();
// 		message.channel.send(success);
// 	} catch (err) {
// 		console.log(err);
// 		message.channel.send(`An error occurred: \`${err.message}\``);
// 	}
// });
