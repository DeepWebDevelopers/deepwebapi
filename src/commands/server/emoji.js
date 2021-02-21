const commando = require("discord.js-commando");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "emoji",
			aliases: ["emoji-info", "emote"],
			group: "info",
			memberName: "emoji",
			description: "Responds with detailed information on an emoji.",
			guildOnly: true,
			clientPermissions: ["EMBED_LINKS"],
			args: [
				{
					key: "emoji",
					prompt: "Which emoji would you like to get information on?",
					type: "custom-emoji",
				},
			],
			throttling: {
				usages: 3,
				duration: 60,
			},
		});
	}

	run(msg, { emoji }) {
		const embed = new MessageEmbed()
			.setColor(0x00ae86)
			.setThumbnail(emoji.url)
			.addField("❯ Name", emoji.name, true)
			.addField("❯ ID", emoji.id, true)
			.addField(
				"❯ Creation Date",
				moment.utc(emoji.createdAt).format("MM/DD/YYYY h:mm A"),
				true
			)
			.addField("❯ Animated?", emoji.animated ? "Yes" : "No", true);
		return msg.embed(embed);
	}
};
