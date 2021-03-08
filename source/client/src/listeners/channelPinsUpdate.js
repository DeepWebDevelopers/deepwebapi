const Discord = require("discord.js");
module.exports = (client) => {
	client.on("channelPinsUpdate", (channel) => {
		let modlog = channel.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Pinned Messages Updated in " + channel.name)
			.addFields(
				{
					name: "Message Content:",
					value: channel.messages.cache.first().content,
				},
				{
					name: "Channel ID: ",
					value: `${channel.id}`,
				},
				{
					name: "Message ID: ",
					value: `${channel.messages.cache.first().id}`,
				}
			)
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Channel Pin",
	dbName: "Terminalcc",
	loadDBFirst: true,
};
