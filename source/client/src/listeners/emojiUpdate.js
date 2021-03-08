const Discord = require("discord.js");
module.exports = (client) => {
	client.on("emojiUpdate", (oldE, newC) => {
		let modlog = newC.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Emoji Updated")
			.setDescription(`**Animated?** ${newC.animated ? "Yes" : "No"}`)
			.addFields(
				{
					name: "Emoji name: ",
					value: `${newC.name}`,
				},
				{
					name: "Emoji ID: ",
					value: `${newC.id}`,
				}
			)
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Emoji Update",
	dbName: "Terminalemoji",
	loadDBFirst: true,
};
