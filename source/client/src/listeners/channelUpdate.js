const Discord = require("discord.js");
module.exports = (client) => {
	client.on("channelUpdate", (oldC, newC) => {
		let modlog = newC.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Channel Updated")
			.addFields(
				{
					name: "Channel name:",
					value: newC.name,
				},
				{
					name: "Channel ID: ",
					value: newC.id,
				}
			)
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Channel Update",
	dbName: "Terminalcc",
	loadDBFirst: true,
};
