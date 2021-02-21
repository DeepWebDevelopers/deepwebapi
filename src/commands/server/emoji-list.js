const commando = require("discord.js-commando");
const { list } = require("../../util/formating");
const types = ["animated", "regular"];
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "emoji-list",
			aliases: ["emojis", "emotes", "emote-list"],
			group: "info",
			memberName: "emoji-list",
			description: "Responds with a list of the server's custom emoji.",
			guildOnly: true,
			args: [
				{
					key: "type",
					prompt: `What type of emoji would you like to view? Either ${list(
						types,
						"or"
					)}.`,
					type: "string",
					default: "regular",
					oneOf: types,
					parse: (type) => type.toLowerCase(),
				},
			],
			throttling: {
				usages: 3,
				duration: 60,
			},
		});
	}
	run(msg, { type }) {
		const emojis = msg.guild.emojis.cache.filter((emoji) =>
			type === "animated" ? emoji.animated : !emoji.animated
		);
		if (!emojis.size)
			return msg.say(`This server has no ${type} custom emoji.`);
		return msg.say(
			emojis
				.map((emoji) => emoji.toString())
				.sort()
				.join(" "),
			{ split: { char: " " } }
		);
	}
};
