const commando = require("discord.js-commando");
const { Client, Message, MessageEmbed } = require("discord.js");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "sourceb",
			aliases: ["sourcebin", "codebin"],
			group: "other",
			memberName: "soucebin-command",
			description: "Sends your code as a code block",
			//	userPermissions: [],
			clientPermissions: ["EMBED_LINKS"],
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: false,
			nsfw: false,
			throttling: {
				usages: 3,
				duration: 20,
			},
		});
	}
	async run(message, args) {
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
	}
};
