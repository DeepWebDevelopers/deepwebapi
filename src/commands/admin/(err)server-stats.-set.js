// const commando = require("discord.js-commando");
// const guildDB = require("../../db/server-stats");
//const client = require('discord.js')

// module.exports = class Command extends (
// 	commando.Command
// ) {
// 	constructor(client) {
// 		super(client, {
// 			name: "setstats",
// 			group: "admin",
// 			memberName: "stats-set-command",
// 			description: "Sets the human, bot, and member count system.",
// 			userPermissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
// 			clientPermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
// 			argsType: "multiple",
// 			guildOnly: true,
// 			ownerOnly: false,
// 			nsfw: false,
// 			throttling: {
// 				usages: 2,
// 				duration: 30,
// 			},
// 		});
// 	}
// 	async run(message, args) {
// 		setInterval(() => {
// 			let client = message;
// 			client.guilds.cache.forEach(async (y) => {
// 				let db = await guildDB.findOne({ guildID: y.id });
// 				if (db) {
// 					// Checking Members channel
// 					const channel1 = y.channels.cache.get(db.stats_members);
// 					if (channel1)
// 						channel1.setName(`👥| Members: ${y.members.cache.size}`);

// 					// Checking humans channel
// 					const channel2 = y.channels.cache.get(db.stats_users);
// 					if (channel2)
// 						channel2.setName(
// 							`👨| Humans: ${
// 								y.members.cache.filter((member) => !member.user.bot).size
// 							}`
// 						);

// 					// Checking bots channel
// 					const channel3 = y.channels.cache.get(db.stats_bots);
// 					if (channel3)
// 						channel3.setName(
// 							`🤖| Bots: ${
// 								y.members.cache.filter((member) => member.user.bot).size
// 							}`
// 						);
// 				}
// 			});
// 		}, 30000);

// 		const Discord = require("discord.js");
// 		const Guild = require("../../db/server-stats");
// 		// if (!message.member.hasPermission("ADMINISTRATOR" || "MANAGE_GUILD"))
// 		// 	return message.channel.send(
// 		// 		"You need administrator permissions to use this command"
// 		// 	);
// 		const db = await Guild.findOne({ guildID: message.guild.id });
// 		if (!args[0]) {
// 			message.channel.send(
// 				new Discord.MessageEmbed()
// 					.setDescription(
// 						"🛠️`Usage:`\n**setstats `setup`** \n**setstats `remove`**"
// 					)
// 					.setTimestamp()
// 			);
// 		} else if (args[0] === "setup") {
// 			message.react("✅");
// 			try {
// 				let mess = message.channel
// 					.send("Operation started! Please wait ...")
// 					.then((m) => m.delete({ timeout: 5000 }));
// 				message.guild.channels
// 					.create(`📚 | Server STATS`, { type: "category" })
// 					.then((parent) =>
// 						Promise.all([
// 							message.guild.channels
// 								.create(`👥| Members: ${message.guild.members.cache.size}`, {
// 									type: "voice",
// 									parent,
// 									permissionOverwrites: [
// 										{ id: message.guild.id, deny: ["CONNECT"] },
// 									],
// 								})
// 								.then(async (m) => {
// 									await db.updateOne({ stats_members: m.id });
// 								}),
// 							message.guild.channels
// 								.create(
// 									`👨| Humans: ${
// 										message.guild.members.cache.filter(
// 											(member) => !member.user.bot
// 										).size
// 									}`,
// 									{
// 										type: "voice",
// 										parent,
// 										permissionOverwrites: [
// 											{ id: message.guild.id, deny: ["CONNECT"] },
// 										],
// 									}
// 								)
// 								.then(async (m) => {
// 									await db.updateOne({ stats_users: m.id });
// 								}),
// 							message.guild.channels
// 								.create(
// 									`🤖| Bots: ${
// 										message.guild.members.cache.filter(
// 											(member) => member.user.bot
// 										).size
// 									}`,
// 									{
// 										type: "voice",
// 										parent,
// 										permissionOverwrites: [
// 											{ id: message.guild.id, deny: ["CONNECT"] },
// 										],
// 									}
// 								)
// 								.then(async (m) => {
// 									await db.updateOne({ stats_bots: m.id });
// 								}),
// 						])
// 					)
// 					.then(async () =>
// 						message.channel
// 							.send(
// 								new Discord.MessageEmbed()
// 									.setDescription("Setup 10/10")
// 									.setTimestamp()
// 									.setColor("GREEN")
// 							)
// 							.then((m) => m.delete({ timeout: 15000 }))
// 					);
// 			} catch (error) {
// 				message.reply("ERROR: " + error);
// 			}
// 		} else if (args[0] === "remove") {
// 			try {
// 				let channel1 = message.guild.channels.cache.get(db.stats_members);
// 				if (channel1) channel1.delete();
// 				let channel2 = message.guild.channels.cache.get(db.stats_users);
// 				if (channel2) channel2.delete();
// 				let channel3 = message.guild.channels.cache.get(db.stats_bots);
// 				if (channel2) channel3.delete();
// 				await db.updateOne({ stats_members: "null" });
// 				await db.updateOne({ stats_users: "null" });
// 				await db.updateOne({ stats_bots: "null" });
// 				return message.channel.send("Server stats removed succesfully");
// 			} catch (error) {
// 				message.reply("ERROR: " + error);
// 			}
// 		}
// 	}
// };
