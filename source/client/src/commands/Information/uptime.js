const Discord = require("discord.js");
module.exports = {
	name: "uptime",
	aliases: ["up", "runtime"],
	minArgs: 0,
	maxArgs: 0,
	cooldown: "10s",
	description: "Checks how long the bot has been running for.",
	category: "Fun & Games",
	run: async ({ message, args, text, client, prefix, instance }) => {
		var seconds = parseInt((client.uptime / 1000) % 60),
			minutes = parseInt((client.uptime / (1000 * 60)) % 60),
			hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24);
		// prettier-ignore
		hours = (hours < 10) ? ('0' + hours) : hours;
		// prettier-ignore
		minutes = (minutes < 10) ? ('0' + minutes) : minutes;
		// prettier-ignore
		seconds = (seconds < 10) ? ('0' + seconds) : seconds;
		let embed = new Discord.MessageEmbed()
			.setTimestamp()
			.setTitle(`${message.client.user.username}'s uptime.`)
			.setDescription(
				`:chart_with_upwards_trend: I've been running for **${hours}** hours, **${minutes}** minutes and **${seconds}** seconds!`
			)
			.setColor("#c28ada")
			.setThumbnail(message.guild.iconURL())
			.setFooter(
				`Powered by the DeepWebDevelopers`,
				message.author.displayAvatarURL()
			);

		await message.channel.send(embed);
	},
};
