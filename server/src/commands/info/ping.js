const commando = require("discord.js-commando");
const Command = require("../../util/base");
module.exports = class PingCommand extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "ping",
			group: "info",
			memberName: "pingcommand",
			description: "Shows the bots ping.",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: false,
			ownerOnly: false,
			nsfw: false,
			throttling: {
				usages: 2,
				duration: 20,
			},
		});
	}
	async run(message, args) {
		const Discord = require("discord.js");

		const embed2 = new Discord.MessageEmbed()
			.setTitle("🏓 Ping")
			.addField(
				"**API Latency**",
				`\`${Math.round(message.client.ws.ping)} ms\``
			)
			.setTimestamp()
			.setThumbnail(message.guild.iconURL())
			.setFooter(
				`Powered by ThatGuyJamal#2695`,
				message.author.displayAvatarURL()
			)
			.setColor("#c28ada");
		message.channel.send(embed2);
	}
};
