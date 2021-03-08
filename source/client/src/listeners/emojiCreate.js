const Discord = require("discord.js");
module.exports = (client) => {
	client.on("emojiCreate", (emoji) => {
		let modlog = emoji.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Emoji Added")
			.setDescription(`**Animated?** ${emoji.animated ? "Yes" : "No"}`)
			.addFields(
				{
					name: "Emoji name: ",
					value: `${emoji.name}`,
				},
				{
					name: "Emoji ID: ",
					value: `${emoji.id}`,
				}
			)
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Emoji Create",
	dbName: "Terminalemoji",
	loadDBFirst: true,
};
