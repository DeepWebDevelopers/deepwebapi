const Discord = require("discord.js");
module.exports = (client) => {
	client.on("roleCreate", (role) => {
		let modlog = role.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Role Created")
			.addFields(
				{
					name: "Role name: ",
					value: `${role.name}`,
				},
				{
					name: "Role ID: ",
					value: `${role.id}`,
				},
				{
					name: "Hex Color:",
					value: `${role.hexColor}`,
				}
			)
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Role Create",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
