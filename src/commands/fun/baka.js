const commando = require("discord.js-commando");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = class bakaCommand extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "baka",
			group: "fun",
			memberName: "baka",
			description: "Stupid!",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 15,
			},
		});
	}
	async run(message, args) {
		const { body } = await superagent.get("https://nekos.life/api/v2/img/baka");
		if (message.mentions.users.size < 1)
			return message.channel.send("BAKA...💩 (Pls @ someone)");
		let user = message.guild.member(message.mentions.users.first());
		const danceEmbed = new Discord.MessageEmbed()
			.setTitle("BAKA!!!")
			.setColor("RANDOM")
			.setImage(body.url)
			.setTimestamp();
		message.channel.send(danceEmbed);
	}
};
