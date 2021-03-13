const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "gaycheck",
			aliases: ["gay", "howgay"],
			group: "fun",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "gay_check_command",
			description: "checks how gay a user is based on 99% real math.",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 35,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		const mentionedMember = message.mentions.users.first();
		if (!mentionedMember)
			return message.channel.send(
				"You need to mention someone before checking"
			);

		const gayr8 = Math.floor(Math.random() * 100) + 0;
		const embed = new Discord.MessageEmbed()
			.setTitle(`Gayr8 Machine`)
			.setDescription(`:rainbow_flag: ${mentionedMember} is ${gayr8}% gay`)
			.setFooter(`Totally real gay rate checker`)
			.setColor(`RANDOM`);
		message.channel.send(embed);
	}
};
