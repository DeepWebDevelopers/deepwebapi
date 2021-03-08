const Discord = require("discord.js");
module.exports = (client) => {
	client.on("messageDeleteBulk", (messages) => {
		let modlog = messages
			.first()
			.channel.guild.channels.cache.find((channel) =>
				channel.name.includes("t-modlog")
			);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(messages.array().length + " Messages Cleared")
			.addFields({
				name: "Channel:",
				value: `${messages.first().channel.name} (${
					messages.first().channel.id
				})`,
			})
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Message Delete Bulk",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
