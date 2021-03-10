const commando = require("discord.js-commando");
const { canModifyQueue } = require("../../util/Music/Music_defaults");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "pause",
			group: "music",
			memberName: "musisc-comwdsamand-0awdawd",
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

		if (queue.playing) {
			queue.playing = false;
			queue.connection.dispatcher.pause(true);
			return queue.textChannel
				.send(`${message.author} ⏸ paused the music.`)
				.catch(console.error);
		}
	}
};
