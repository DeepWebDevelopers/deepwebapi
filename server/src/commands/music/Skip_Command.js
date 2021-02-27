const commando = require("discord.js-commando");
const { canModifyQueue } = require("../../util/Music/Music_defaults");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "skip-song",
			aliases: ["skip"],
			group: "music",
			memberName: "music-command-23er023r908jew",
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
			return message
				.reply("There is nothing playing that I could skip for you.")
				.catch(console.error);
		if (!canModifyQueue(message.member)) return;

		queue.playing = true;
		queue.connection.dispatcher.end();
		queue.textChannel
			.send(`${message.author} ⏭ skipped the song`)
			.catch(console.error);
	}
};
