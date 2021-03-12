const mongo = require("../../mongo");
const banSchema = require("../../db/ban");
const Guild = require("../../db/guild/logging");
var d = new Date(Date.now());
const Discord = require("discord.js");

module.exports = {
	name: "unban",
	requiredPermissions: ["BAN_MEMBERS"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<user ID> [reason]",
	testOnly: true,
	description: "Unban a user from the Discord server",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const nologtext = `There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`;

		if (!message.guild.me.hasPermission("BAN_MEMBERS"))
			return message.channel.send(
				"**I Dont Have The Permissions To UnBan Users! - [BAN_MEMBERS]**"
			);
		const guildDB = await Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, guild) => {
				if (err) console.error(err);

				if (!guild) {
					return;
				}
			}
		);

		try {
			const logChannel = message.guild.channels.cache.get(guildDB.logChannelID);
		} finally {
			const logChannel = message.guild.channels.cache.get(guildDB.logChannelID);
		}
		const logChannel = message.guild.channels.cache.get(guildDB.logChannelID);

		try {
			var targetId = args[0];
		} catch (e) {
			console.log(e);
			return message.channel
				.send("❌Not a valid user!")
				.then((m) => m.delete({ timeout: 10000 }));
		}

		const reason = args[1] ? args.slice(1).join(" ") : "no reason was given";

		const embed = new Discord.MessageEmbed().setFooter(
			`${message.author.tag} | ${message.author.id}`,
			message.author.displayAvatarURL({ dynamic: true })
		);

		await mongo().then(async (mongoose) => {
			try {
				try {
					const data = await banSchema.findOneAndDelete({
						banId: targetId,
						guildId: message.guild.id,
					});

					if (!data) return;
				} finally {
					message.guild
						.fetchBans()
						.then((bans) => {
							const user = bans.find((ban) => ban.user.id === targetId);

							if (!logChannel) {
								return message.reply(
									"The user was still Unbanned, but you have not created/set a modlogs channel."
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
								message.react("👍");
							} else {
								embed
									.setTitle(`User ${member} isn't banned!`)
									.setColor("#ff0000");
								message.channel.send(embed);
							}
						})
						.catch((e) => {
							console.log(e);
							message.channel.send("❌An error has occurred!");
						});
				}
			} catch (err) {
				console.log(err);
				// message.channel.send(`An error occurred: \`${err.message}\``);
			}
		});
	},
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
