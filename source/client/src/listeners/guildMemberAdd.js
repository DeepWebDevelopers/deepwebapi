const Discord = require("discord.js");
const canvas = require("discord-canvas"),
	welcomeCanvas = new canvas.Welcome();

module.exports = (client) => {
	client.on("guildMemberAdd", async (member) => {
		let channel = member.guild.channels.cache.find((channel) =>
			channel.name.includes("welcome" || "joins" || "members" || "t-welcome")
		);
		if (!channel) return;

		const welcomeCard = await welcomeCanvas
			.setUsername(member.user.username)
			.setDiscriminator(member.user.discriminator)
			.setMemberCount(member.guild.memberCount)
			.setGuildName(member.guild.name)
			.setAvatar(
				member.user.displayAvatarURL({
					dynamic: false,
					format: "png",
				})
			)
			.setColor("border", "#FFBA49")
			.setColor("username-box", "#FFBA49")
			.setColor("discriminator-box", "#FFBA49")
			.setColor("message-box", "#FFBA49")
			.setColor("title", "#FFBA49")
			.setColor("avatar", "#FFBA49")
			.setBackground(
				"https://coolbackgrounds.io/images/backgrounds/index/sea-edge-79ab30e2.png"
			)
			.toAttachment();

		const attachment = new Discord.MessageAttachment(
			welcomeCard.toBuffer(),
			"welcome.png"
		);
		channel.send(attachment);

		let modlog = member.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Member Joined")
			.setDescription(`**Bot?** ${member.user.bot ? "Yes" : "No"}`)
			.addFields({
				name: "User Information:",
				value: `${member.user.username}#${member.user.discriminator} (${member.id})`,
			})
			.setTimestamp()
			.setThumbnail(
				member.user.displayAvatarURL({
					dynamic: true,
					format: "png",
				})
			);
		modlog.send(logEmbed);
	});
};

module.exports.config = {
	displayName: "Member Add",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
