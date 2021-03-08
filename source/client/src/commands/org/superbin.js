const { Client, Message, MessageEmbed } = require("discord.js");
module.exports = {
	name: "npm",
	aliases: ["nodedocs", "npmsr"],
	minArgs: 0,
	maxArgs: 0,
	expectedArgs: "<query>",
	cooldown: "10s",
	description: "Checks how long the bot has been running for.",
	category: "Fun & Games",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!args.join(" "))
			return message
				.reply("You did not send any code?")
				.then((m) => m.delete({ timeout: 4000 }));
		const sourcebin = require("sourcebin_js");
		sourcebin
			.create([
				{
					name: `Code by ${message.author.tag}`,
					content: args.join(" "),
					languageId: "js",
				},
			])
			.then((src) => {
				message.channel.send(src.url);
			})
			.catch((e) => {
				message.channel.send(`Error, try again later`);
			});
	},
};
