const Discord = require("discord.js");

module.exports = (client) => {
	client.on("guildMemberUpdate", async (oldM, newM) => {
		let modlog = newM.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Member Updated")
			.setDescription(`**Bot?** ${newM.user.bot ? "Yes" : "No"}`)
			.addFields({
				name: "User Information:",
				value: `${newM.user.username}#${newM.user.discriminator} (${newM.id})`,
			})
			.setTimestamp()
			.setThumbnail(
				newM.user.displayAvatarURL({
					dynamic: true,
					format: "png",
				})
			);
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Member Update",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
