const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
module.exports = {
	name: "soucebin",
	aliases: ["bin", "codebin"],
	minArgs: 0,
	maxArgs: 0,
	expectedArgs: "<query>",
	cooldown: "10s",
	description: "Checks how long the bot has been running for.",
	category: "Org",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const embed = new MessageEmbed()

			.setTitle("Why Use a Paste Bin?")
			.setColor("#c28ada")
			.setDescription(
				"Its a bit ugly to send all your code / text in a discord channel, but using a bin will make viewing code a lot easier and user friendly for everyone! "
			)
			.addField(
				"Bins to use:",
				"[SourceBinLink](https://sourceb.in/), [HasteBinLink](https://hasteb.in/), [PasteNomsyLink](https://paste.nomsy.net/), [Pasteie.ioLink](https://pastie.io/)"
			)
			.setTimestamp()
			.setThumbnail(message.author.displayAvatarURL())
			.setFooter(
				"Try to use a bin when showing lots of text.",
				message.author.displayAvatarURL()
			);

		message.channel.send(embed);
	},
};
