const Discord = require("discord.js");
const math = require("mathjs");
module.exports = {
	name: "calc",
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<math input>",
	description: "Math calculator",
	category: "Utility",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!args[0]) return message.channel.send("Input a calculaton");

		let resp;

		try {
			resp = math.evaluate(args.join(" "));
		} catch (e) {
			return message.channel.send("Sorry, invalid calculation.");
		}

		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Calculator")
			.setAuthor(message.author.tag, message.author.avatarURL())
			.setThumbnail(message.client.user.avatarURL())
			.setTimestamp()
			.setFooter("Thank you for using Terminal!")
			.addField("Input: ", `\`\`\`${args.join(" ")}\`\`\``)
			.addField("Output", `\`\`\`${resp}\`\`\``);

		message.channel.send(embed);
	},
};
