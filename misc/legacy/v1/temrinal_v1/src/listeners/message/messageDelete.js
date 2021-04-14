const Discord = require("discord.js");
module.exports = (client) => {
	client.on("messageDelete", (message) => {
		let modlog = message.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Message Deleted")
			.addFields(
				{
					name: "Content:",
					value: `${message.content}`,
				},
				{
					name: "Channel:",
					value: `${message.channel.name} (${message.channel.id})`,
				},
				{
					name: "Sender:",
					value: `${message.author.username}#${message.author.discriminator} (${message.author.id})`,
				}
			)
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Message Delete",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
