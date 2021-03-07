module.exports = async (client, message) => {
	//! When the bot joins a new guild, it will send this message to a random channel.
	client.on("guildCreate", (guild) => {
		const prefix = guild.commandPrefix;
		try {
			const channel = guild.channels.cache.find(
				(channel) =>
					channel.type === "text" &&
					channel.permissionsFor(guild.me).has("SEND_MESSAGES")
			);
		} catch (error) {
			return console.log(error);
		}
		const onJoiningNewServer = new Discord.MessageEmbed()
			.setTitle(`Thank you for inviting me to \`\`${guild.name}\`\`!`)
			.addFields(
				{
					name: `Why don't you check out my website?`,
					value: `[Website *coming soon*](${config.website_api})`, // This is optional if you have a website
					inline: true,
				},
				{
					name: `My default prefix is ${prefix}`,
					value: `\`\`(${prefix})\`\` but you can always change it by running (${prefix})prefix (New Prefix)`, // This is optional if you have a have a chane prefix commands
					inline: true,
				},
				{
					name: `My commands`,
					value: `I would recomend trying (${prefix})help or (${prefix})commands!`, // This is optional if you have a help or command commands
					inline: true,
				},
				{
					name: `If you have any problems with me please join are server! And we will try and fix the error!`,
					value: `[Discord Server Link](https://discord.gg/NbqBQbaejS)`, // This is optional if you have a support server
					inline: true,
				},
				{
					name: `If you want to invite me to your server please click Invite me!`,
					value: `[Invite me!](${config.auth})`, // This is optional if you want over people to invite your bot to different servers!
					inline: true,
				}
			)
			.setFooter(
				`And a special thanks from the creator of ${client.user.username} (ThatGuyJamal#2695)`
			);
		channel.send(onJoiningNewServer);
	});
};
