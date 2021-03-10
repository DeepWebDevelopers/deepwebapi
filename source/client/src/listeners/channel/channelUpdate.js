// const Discord = require("discord.js");
// const Logs = require("../../db/guild/logging");
// module.exports = (client, message) => {
// 	client.on("channelUpdate", async (client, oldChannel, newChannel) => {
// 		//! Will not work until db functions are added,.
// 		let ChannelLogs = guild.channels.cache.find((channel) =>
// 			channel.name.includes("t-modlog")
// 		);
// 		// let ChannelLogs = await Logs.findOne({ guildID: message.guild.id });
// 		if (!ChannelLogs) return;

// 		if (!newChannel.guild.member(client.user).hasPermission("VIEW_AUDIT_LOG"))
// 			return;

// 		newChannel.guild.fetchAuditLogs().then(async (logs) => {
// 			let userID = logs.entries.first().executor;

// 			if (oldChannel.name !== newChannel.name) {
// 				const embedNewName = new Discord.MessageEmbed()
// 					.setTitle("__**ChannelNameUpdate**__")
// 					.setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
// 					.setAuthor(
// 						newChannel.guild.name,
// 						newChannel.guild.iconURL({ dynamic: true })
// 					)
// 					.addField("**Channel:**", `<#${newChannel.id}> | ${newChannel.id}`)
// 					.addField(
// 						"**Created At:**",
// 						newChannel.createdAt.toUTCString().substr(0, 16)
// 					)
// 					.addField(
// 						"**Parent:**",
// 						newChannel.parent ? newChannel.parent.name : "Has no Parent"
// 					)
// 					.addField("**Old Name:**", oldChannel.name)
// 					.addField("**New Name:**", newChannel.name)
// 					.addField("**Change By:**", userID.tag)
// 					.setFooter(
// 						"Helper Bot | Logs",
// 						client.user.displayAvatarURL({ dynamic: true })
// 					)
// 					.setColor("RANDOM");
// 				newChannel.guild.channels
// 					.resolve(ChannelLogs.ChannelID)
// 					.send(embedNewName);
// 			}

// 			if (oldChannel.topic !== newChannel.topic) {
// 				const embedNewTopic = new Discord.MessageEmbed()
// 					.setTitle("__**ChannelTopicUpdate**__")
// 					.setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
// 					.setAuthor(
// 						newChannel.guild.name,
// 						newChannel.guild.iconURL({ dynamic: true })
// 					)
// 					.addField("**Channel:**", `<#${newChannel.id}> | ${newChannel.id}`)
// 					.addField(
// 						"**Created At:**",
// 						newChannel.createdAt.toUTCString().substr(0, 16)
// 					)
// 					.addField(
// 						"**Parent:**",
// 						newChannel.parent ? newChannel.parent.name : "Has no Parent"
// 					)
// 					.addField(
// 						"**Old Topic:**",
// 						oldChannel.topic ? oldChannel.topic : "Has No Description"
// 					)
// 					.addField(
// 						"**New Topic:**",
// 						newChannel.topic ? newChannel.topic : "Has No Description"
// 					)
// 					.addField("**Change By:**", userID.tag)
// 					.setFooter(
// 						"Helper Bot | Logs",
// 						client.user.displayAvatarURL({ dynamic: true })
// 					)
// 					.setColor("RANDOM");
// 				newChannel.guild.channels
// 					.resolve(ChannelLogs.ChannelID)
// 					.send(embedNewTopic);
// 			}

// 			if (!oldChannel.nsfw && newChannel.nsfw) {
// 				const embedNSFW = new Discord.MessageEmbed()
// 					.setTitle("__**ChannelNsfwUpdate**__")
// 					.setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
// 					.setAuthor(
// 						newChannel.guild.name,
// 						newChannel.guild.iconURL({ dynamic: true })
// 					)
// 					.setDescription("Channel is now **NSFW**")
// 					.addField("**Channel:**", `<#${newChannel.id}> | ${newChannel.id}`)
// 					.addField(
// 						"**Created At:**",
// 						newChannel.createdAt.toUTCString().substr(0, 16)
// 					)
// 					.addField(
// 						"**Parent:**",
// 						newChannel.parent ? newChannel.parent.name : "Has no Parent"
// 					)
// 					.addField("**Old NSFW:**", oldChannel.nsfw ? "Yes" : "No")
// 					.addField("**New NSFW:**", newChannel.nsfw ? "Yes" : "No")
// 					.addField("**Change By:**", userID.tag)
// 					.setFooter(
// 						"Helper Bot | Logs",
// 						client.user.displayAvatarURL({ dynamic: true })
// 					)
// 					.setColor("RANDOM");
// 				newChannel.guild.channels
// 					.resolve(ChannelLogs.ChannelID)
// 					.send(embedNSFW);
// 			}

// 			if (oldChannel.nsfw && !newChannel.nsfw) {
// 				const embedNoNSFW = new Discord.MessageEmbed()
// 					.setTitle("__**ChannelNsfwUpdate**__")
// 					.setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
// 					.setAuthor(
// 						newChannel.guild.name,
// 						newChannel.guild.iconURL({ dynamic: true })
// 					)
// 					.setDescription("The channel is no longer **NSFW**")
// 					.addField("**Channel:**", `<#${newChannel.id}> | ${newChannel.id}`)
// 					.addField(
// 						"**Created At:**",
// 						newChannel.createdAt.toUTCString().substr(0, 16)
// 					)
// 					.addField(
// 						"**Parent:**",
// 						newChannel.parent ? newChannel.parent.name : "Has no Parent"
// 					)
// 					.addField("**Old NSFW:**", oldChannel.nsfw ? "Yes" : "No")
// 					.addField("**New NSFW:**", newChannel.nsfw ? "Yes" : "No")
// 					.addField("**Change By:**", userID.tag)
// 					.setFooter(
// 						"Helper Bot | Logs",
// 						client.user.displayAvatarURL({ dynamic: true })
// 					)
// 					.setColor("RANDOM");
// 				newChannel.guild.channels
// 					.resolve(ChannelLogs.ChannelID)
// 					.send(embedNoNSFW);
// 			}

// 			if (oldChannel.parent !== newChannel.parent) {
// 				const embedNewParent = new Discord.MessageEmbed()
// 					.setTitle("__**ChannelParentUpdate**__")
// 					.setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
// 					.setAuthor(
// 						newChannel.guild.name,
// 						newChannel.guild.iconURL({ dynamic: true })
// 					)
// 					.setDescription("The channel changed parent")
// 					.addField("**Channel:**", `<#${newChannel.id}> | ${newChannel.id}`)
// 					.addField(
// 						"**Created At:**",
// 						newChannel.createdAt.toUTCString().substr(0, 16)
// 					)
// 					.addField(
// 						"**Old Parent:**",
// 						oldChannel.parent ? oldChannel.parent.name : "Has no Parent"
// 					)
// 					.addField(
// 						"**New Parent:**",
// 						newChannel.parent ? newChannel.parent.name : "Has no Parent"
// 					)
// 					.addField("**Change By:**", userID.tag)
// 					.setFooter(
// 						"Helper Bot | Logs",
// 						client.user.displayAvatarURL({ dynamic: true })
// 					)
// 					.setColor("RANDOM");
// 				newChannel.guild.channels
// 					.resolve(ChannelLogs.ChannelID)
// 					.send(embedNewParent);
// 			}
// 		});
// 	});
// };

module.exports.config = {
	displayName: "Channel Update",
	dbName: "Terminalcc",
	loadDBFirst: true,
};
