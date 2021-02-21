const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
module.exports = class UptimeCommand extends (
	Command
) {
	constructor(client) {
		super(client, {
			name: "uptime",
			aliases: ["alive", "up", "online"],
			memberName: "uptime",
			group: "info",
			description: "Replies with the bot's total uptime.",
		});
	}
	async run(message) {
		var seconds = parseInt((this.client.uptime / 1000) % 60),
			minutes = parseInt((this.client.uptime / (1000 * 60)) % 60),
			hours = parseInt((this.client.uptime / (1000 * 60 * 60)) % 24);
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
				`Powered by ThatGuyJamal#2695`,
				message.author.displayAvatarURL()
			);

		await message.channel.send(embed);
	}
};
