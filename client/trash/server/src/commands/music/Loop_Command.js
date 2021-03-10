const commando = require("discord.js-commando");
const { canModifyQueue } = require("../../util/Music/Music_defaults");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "loop",
			group: "music",
			memberName: "muasic-command-0awd324e",
			description: "..",
			userPermissions: ["CONNECT", "VIEW_CHANNEL"],
			clientPermissions: ["SPEAK", "CONNECT"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		const queue = message.client.queue.get(message.guild.id);
		if (!queue)
			return message.reply("There is nothing playing.").catch(console.error);
		if (!canModifyQueue(message.member)) return;

		// toggle from false to true and reverse
		queue.loop = !queue.loop;
		return queue.textChannel
			.send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
			.catch(console.error);
	}
};
