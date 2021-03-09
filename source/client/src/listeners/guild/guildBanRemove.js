const Discord = require("discord.js");
module.exports = (client) => {
	client.on("guildBanRemove", (guild, user) => {
		let modlog = guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Member Unbanned")
			.setDescription(`**Bot?** ${user.bot ? "Yes" : "No"}`)
			.addFields({
				name: "User Information:",
				value: `${user.username}#${user.discriminator} (${user.id})`,
			})
			.setTimestamp();
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Unban",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
