const Discord = require("discord.js");
const canvas = require("discord-canvas"),
	goodbyeCanvas = new canvas.Goodbye();

module.exports = (client) => {
	client.on("guildMemberRemove", async (member) => {
		let channel = member.guild.channels.cache.find((channel) =>
			channel.name.includes("t-goodbye" || "leaves" || "joins" || "members")
		);
		if (!channel) return;

		const goodbyeCard = await goodbyeCanvas
			.setUsername(member.user.username)
			.setDiscriminator(member.user.discriminator)
			.setMemberCount(member.guild.memberCount + 1)
			.setGuildName(member.guild.name)
			.setAvatar(
				member.user.displayAvatarURL({
					dynamic: false,
					format: "png",
				})
			)
			.setColor("border", "#a33c70")
			.setColor("username-box", "#a33c70")
			.setColor("discriminator-box", "#a33c70")
			.setColor("message-box", "#a33c70")
			.setColor("title", "#a33c70")
			.setColor("avatar", "#a33c70")
			.setBackground(
				"https://cdn.trendhunterstatic.com/thumbs/cool-backgrounds.jpeg"
			)
			.toAttachment();

		const attachment = new Discord.MessageAttachment(
			goodbyeCard.toBuffer(),
			"goodbye.png"
		);
		channel.send(attachment);

		let modlog = member.guild.channels.cache.find((channel) =>
			channel.name.includes("t-modlog")
		);
		if (!modlog) return;

		const logEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Member Left")
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
	displayName: "Member Remove",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
