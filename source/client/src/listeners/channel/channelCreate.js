const Discord = require("discord.js");
const Logs = require("../../db/guild/logging");
module.exports = (client) => {
	client.on("channelCreate", async (channel) => {
		if (channel.type === "dm") return;

		let ChannelLogs = await Logs.findOne({ guild: channel.guild.id });
		if (!ChannelLogs) return;

		let type = {
			dm: "DM",
			text: "Text",
			voice: "Voice",
			category: "Category",
			news: "News",
			store: "Store",
			unknown: "Unknown",
		};

		const embedNewChannel = new Discord.MessageEmbed()
			.setTitle("__**ChannelCreate**__")
			.setThumbnail(channel.guild.iconURL({ dynamic: true }))
			.setAuthor(channel.guild.name, channel.guild.iconURL({ dynamic: true }))
			.addField("**Channel Name:**", `${channel.name} | ${channel.id}`)
			.addField("**Channel Type:**", type[channel.type])
			.addField(
				"**Created At:**",
				channel.createdAt.toUTCString().substr(0, 16)
			)
			.addField(
				"**Parent:**",
				channel.parent ? channel.parent.name : "Has no Parent"
			)
			.addField("**NSFW:**", channel.nsfw ? "Yes" : "No")
			.setColor("RANDOM")
			.setFooter(
				"Helper Bot | Logs",
				client.user.displayAvatarURL({ dynamic: true })
			);
		channel.guild.channels.resolve(ChannelLogs.ChannelID).send(embedNewChannel);
	});
};

module.exports.config = {
	displayName: "Channel Create",
	dbName: "Terminalcc",
	loadDBFirst: true,
};
