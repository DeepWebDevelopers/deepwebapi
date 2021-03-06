const Discord = require("discord.js");
const discordXP = require("discord-xp");
const config = require("../../../../config/config.json");
discordXP.setURL(`${config.db}`);
const moment = require("moment");
const { stripIndents, oneLine } = require("common-tags");

module.exports = (client, Channel) => {
	//! Basic message listener events:

	// var type = {
	// 	dm: "DM",
	// 	text: "Text",
	// 	voice: "Voice",
	// 	category: "Category",
	// 	news: "News",
	// 	store: "Store",
	// 	unknown: "Unknown",
	// };

	// Supporting the leveling system.
	let recentMsg = new Set();
	client.on("message", async (message, prefix) => {
		if (
			message.author.id === client.user.id ||
			message.author.bot ||
			message.channel.type === "dm"
		)
			return;

		if (!message.channel.permissionsFor(client.user).has("SEND_MESSAGES")) {
			return;
		}

		try {
			// ? Blacklisting system

			const blacklist = require("../../db/blacklist");
			// path: '../../commands/owner/blacklist.js'
			let blacklisted_User = await blacklist.findOne({
				id: message.author.id,
			});
			if (blacklisted_User) return;
		} finally {
			//? Util Checks

			// let prefix = config.prefix;

			if (message.content === "terminal") {
				message.channel.send(
					`Hello **${message.author.tag}**. My defult prefix is **${config.prefix}.**To check the current server prefix run: **prefix**`
				);
			}
			if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
				message.reply(
					oneLine`Ping me? For support run my **invite** command. If you want to get information on a command, use: **help <command>**.`
				);
			}

			//! Other Message Checks

			//?  XP system
			//Check if the person who sent the message is registered as a Discord Bot
			if (
				message.author.id === client.user.id ||
				message.author.bot ||
				message.channel.type === "dm"
			)
				return;

			//Bot commands only work in servers, so add this to prevent permission errors originating from the DM
			if (!message.guild)
				return cleverbot(message.content).then((response) =>
					message.channel.send(response)
				);

			//Points system
			if (recentMsg.has(message.author.id)) return;
			else {
				recentMsg.add(message.author.id);

				//Generates a random amount of points to add to the member, and adds it to the database
				let earnedXP = Math.floor(Math.random() * 9) + 1;
				let hasLeveledUp = await discordXP.appendXp(
					message.author.id,
					message.guild.id,
					earnedXP
				);

				//Checks if the user leveled up, and notify the member
				if (hasLeveledUp) {
					let XPuser = await discordXP.fetch(
						message.author.id,
						message.guild.id
					);
					message.reply(`GG! You leveled up to level **${XPuser.level}**!`);
				}

				setTimeout(() => {
					// Removes the user from the set after a minute
					recentMsg.delete(message.author.id);
				}, 45000);
			}

			const clientDetails = {
				guilds: client.guilds.cache.size,
				users: client.users.cache.size,
				channels: client.channels.cache.size,
			};

			//? Afk system

			let modelafk = require("../../db/afk"),
				users = message.mentions.users.array(),
				isafk = await modelafk.findOne({ id: message.author.id });
			if (isafk && isafk.isafk) {
				try {
					let data = await modelafk.findOne({ id: message.author.id });
					await modelafk.deleteOne({ id: message.author.id });

					const embedAFK = new Discord.MessageEmbed()
						.setDescription(
							"Hi there! **" +
								message.author.username +
								"**, i have removed your **AFK**"
						)
						.setColor("#00FF42")
						.addField(
							"**AFK time**",
							moment
								.duration(Date.now() - data.timeAfk)
								.format("d [Days], h [Hours], m [Minutes], s [Seconds]", {
									largest: 1,
								})
						)
						.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
						.setFooter(
							message.author.tag,
							message.author.displayAvatarURL({ dynamic: true })
						);
					message.channel.send(embedAFK);
				} catch {
					return console.log(error);
				}
			}
			for (let i of users) {
				let data = await modelafk.findOne({ id: i.id });
				if (data && data.isafk) {
					const embedMentionUserAFK = new Discord.MessageEmbed()
						.setDescription(`<:grinning:>**${i.tag}** is **AFK**`)
						.addField(
							"<:grinning:> **Reason:**",
							"" + data.reason || "Has No Reason" + ""
						)
						.addField(
							"<:grinning:> **Time AFK:**",
							moment
								.duration(Date.now() - data.timeAfk)
								.format("d [Days], h [Hours], m [Minutes], s [Seconds]", {
									largest: 1,
								})
						)
						.setColor("#F3FF0")
						.setFooter(
							message.author.tag,
							message.author.displayAvatarURL({ dynamic: true })
						)
						.setThumbnail(i.displayAvatarURL({ dynamic: true }));
					message.channel.send(embedMentionUserAFK);
					break;
				}
			}
		}
	});
};

module.exports.config = {
	displayName: "Message System",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
