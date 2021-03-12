const Discord = require("discord.js");
module.exports = {
	name: "howgay",
	minArgs: 0,
	maxArgs: 0,
	cooldown: "10s",
	description: "Gay checker",
	category: "Fun & Games",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const mentionedMember = message.mentions.users.first();
		if (!mentionedMember)
			return message.channel.send("You need to mention before checking");
		const gayr8 = Math.floor(Math.random() * 100) + 0;
		const embed = new Discord.MessageEmbed()
			.setTitle(`Gayr8 Machine`)
			.setDescription(`:rainbow_flag: ${mentionedMember} is ${gayr8}% gay`)
			.setFooter(`Totally real gay rate checker`)
			.setColor(`RANDOM`);
		message.channel.send(embed);
	},
};
