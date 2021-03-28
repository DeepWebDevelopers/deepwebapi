const commando = require("discord.js-commando");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "pat",
			group: "fun",
			memberName: "pat_command",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			description: "Pats a user",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 4,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		const { body } = await superagent.get("https://nekos.life/api/pat");
		if (message.mentions.users.size < 1)
			return message.channel.send("How can you pat nobody? 💔");
		let user = message.guild.member(message.mentions.users.first());
		const Patti = new Discord.MessageEmbed()
			.setDescription(
				`${message.author.username} pat's ${user}, What a cutie...❤`
			)
			.setAuthor("Terminal Fun Commands", message.client.user.avatarURL())
			.setColor("RANDOM")
			.setTimestamp()
			.setImage(body.url);
		message.channel.send(Patti);
	}
};
