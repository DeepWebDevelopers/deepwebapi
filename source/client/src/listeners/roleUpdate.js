const Discord = require("discord.js");
module.exports = (client) => {
	client.on("roleUpdate", (oldR, newR) => {
		let modlog = newR.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Role Updated")
			.addFields(
				{
					name: "Role name: ",
					value: `${newR.name}`,
				},
				{
					name: "Role ID: ",
					value: `${newR.id}`,
				},
				{
					name: "Hex Color:",
					value: `${newR.hexColor}`,
				}
			)
			.setTimestamp()
			.setFooter("There could be some spam, sorry!");
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Role Update",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
