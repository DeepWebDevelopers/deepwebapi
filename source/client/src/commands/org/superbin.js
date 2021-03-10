const { Client, Message, MessageEmbed } = require("discord.js");
const sourcebin = require("sourcebin_js");
module.exports = {
	name: "sbin",
	aliases: ["sourceup", "superbin"],
	// expectedArgs: "<code>",
	cooldown: "20s",
	description: "Checks how long the bot has been running for.",
	category: "Org",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!args.join(" "))
			return message
				.reply(`Incorrect Syntax. Exmaple: ${prefix}`)
				.then((m) => m.delete({ timeout: 4000 }));

		sourcebin
			.create([
				{
					name: `Code by ${message.author.tag}`,
					content: args.join(" "),
					languageId: "js",
				},
			])
			.then((src) => {
				message.channel.send(`Here is a link to your code: ${src.url}.`);
			})
			.catch((e) => {
				message.channel.send(`Error, try again later`);
			});
	},
};
