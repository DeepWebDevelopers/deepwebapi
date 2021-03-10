const commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "bin",
			aliases: ["bins", "paste-bins", "code-bins"],
			group: "other",
			memberName: "bins-commands",
			description: "gives the user a bin to user for there paste",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 20,
			},
		});
	}
	async run(message, args) {
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
	}
};
