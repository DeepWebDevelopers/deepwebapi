const Discord = require("discord.js");
module.exports = (client) => {
	client.on("channelCreate", (channel) => {
		if (channel.type === "dm") return;

		let modlog = channel.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Channel created")
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
	displayName: "Channel Create",
	dbName: "Terminalcc",
	loadDBFirst: true,
};
