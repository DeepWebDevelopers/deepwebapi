const Discord = require("discord.js");
module.exports = (client) => {
	client.on("channelDelete", (channel) => {
		if (channel.type === "dm") return;
		let modlog = channel.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Channel deleted")
			.addFields(
				{
					name: "Channel name: ",
					value: `${channel.name}`,
				},
				{
					name: "Channel ID: ",
					value: `${channel.id}`,
				}
			)
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Channel Delete",
	dbName: "Terminalcc",
	loadDBFirst: true,
};
