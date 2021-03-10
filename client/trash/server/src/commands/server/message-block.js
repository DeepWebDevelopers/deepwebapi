const commando = require("discord.js-commando");
const { shorten } = require("../../util/formating");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "message-source",
			aliases: ["msg-source", "message-src", "msg-src", "source", "src"],
			group: "info",
			memberName: "message-source",
			description: "Responds with a codeblock containing a message's contents.",
			args: [
				{
					key: "message",
					prompt: "Which message do you want to get the source of?",
					type: "message",
				},
			],
			throttling: {
				usages: 3,
				duration: 60,
			},
		});
	}

	run(msg, { message }) {
		if (!message.content)
			return msg.reply(
				"That message has no content. Maybe it's an embed or image?"
			);
		return msg.code(null, shorten(message.content, 1990));
	}
};