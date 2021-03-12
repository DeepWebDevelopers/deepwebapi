const Discord = require("discord.js");
const commando = require("discord.js-commando");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "uptime",
			aliases: ["up", "online"],
			group: "information",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			memberName: "uptime_command",
			description: "Sends the bots total uptime.",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 35,
			},
		});
	}
	async run(message, args) {
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
	}
};
