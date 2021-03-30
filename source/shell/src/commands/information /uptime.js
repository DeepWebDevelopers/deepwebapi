const Discord = require("discord.js");
const commando = require("discord.js-commando");
const moment = require("moment");
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
			guildOnly: false,
			throttling: {
				usages: 1,
				duration: 35,
			},
		});
	}
	async run(message, args) {
		// var seconds = parseInt((message.client.uptime / 1000) % 60),
		// 	minutes = parseInt((message.client.uptime / (1000 * 60)) % 60),
		// 	hours = parseInt((message.client.uptime / (1000 * 60 * 60)) % 24);
		// // prettier-ignore
		// hours = (hours < 10) ? ('0' + hours) : hours;
		// // prettier-ignore
		// minutes = (minutes < 10) ? ('0' + minutes) : minutes;
		// // prettier-ignore
		// seconds = (seconds < 10) ? ('0' + seconds) : seconds;
		//? New Uptime formate

		const duration = moment
			.duration(message.client.uptime)
			.format(" D [days], H [hrs], m [mins], s [secs]");

		// ping

		let embed = new Discord.MessageEmbed()
			.setTimestamp()
			.setTitle(`${message.client.user.username}'s uptime.`)
			// .setDescription(
			// 	`:chart_with_upwards_trend: I've been running for **${hours}** hours, **${minutes}** minutes and **${seconds}** seconds!`
			// )
			.setDescription(`⌚️ Uptime  \`${duration}\``)

			.setColor("#2F3136")
			.setThumbnail(message.guild.iconURL())
			.setFooter(
				`Powered by the DeepWebDevelopers`,
				message.author.displayAvatarURL()
			);

		await message.channel.send(embed);
	}
};
