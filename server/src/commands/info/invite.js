const commando = require("discord.js-commando");
const config = require("../../config.json");
const Discord = require("discord.js");

module.exports = class SupportCommand extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "support",
			aliases: ["invite", "bot-server"],
			group: "info",
			guildOnly: false,
			memberName: "support",
			description: "A command that sends an invite link to the support server",
			throttling: {
				usages: 3,
				duration: 60,
			},
		});
	}
	async run(message, args) {
		const supEmbed = new Discord.MessageEmbed()
			.setTitle("Add me to your guild!")
			.setURL(config.auth)
			.setDescription(
				`Need help with the bot? Read my documentation below or join the support server!`
			)
			.addField(
				"My server Invite link",
				`[Click to join!](${config.client_server_invite})`
			)
			.addField("Documentation", `[Documents link](${config.website_api})`)
			.addField("Github", `[Github link](${config.bot_github})`)
			.setFooter(
				"Join our support server for more help and info my development!"
			)
			.setThumbnail("https://i.imgur.com/wSTFkRM.png")
			.setColor("#c28ada")
			.setTimestamp();
		message.author.send(supEmbed);
		message.react("✅");
	}
};
