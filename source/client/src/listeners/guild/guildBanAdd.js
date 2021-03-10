module.exports = (client, message) => {
	client.on("guildBanAdd", async (guild, user) => {
		let modlog = guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;
		const Discord = require("discord.js");
		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Member banned")
			.setDescription(`**Bot?** ${user.bot ? "Yes" : "No"}`)
			.addFields({
				name: "User Information:",
				value: `${user.username}#${user.discriminator} (${user.id})`,
			})
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Ban",
	dbName: "Terminalmod",
	loadDBFirst: true,
};

// client.on("guildBanAdd", async (guild, user) => {
// 	const mongo = require("../../mongo");
// 	await mongo().then(async (mongoose) => {
// 		try {
// 			//? logging
// 			const Logs = require("../../db/guild/logging");
// 			var d = new Date(Date.now());
// 			const guildDB = await Logs.findOne(
// 				{
// 					guildID: message.guild.id,
// 				},
// 				async (err, guild) => {
// 					if (err) console.error(err);

// 					if (!guild) {
// 						return message.reply(
// 							`There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
// 						);
// 					}
// 				}
// 			);
// 			const modlog = message.guild.channels.cache.get(guildDB.logChannelID);
// 			if (!modlog) return;
// 			// embeds
// 		} catch (err) {
// 			console.log(err);
// 			try {
// 				message.channel.send(`An error occurred: \`${err.message}\``);
// 			} catch {
// 				return;
// 			}
// 		}
// 	});
// });
