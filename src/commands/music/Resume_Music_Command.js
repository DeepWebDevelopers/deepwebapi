const commando = require("discord.js-commando");
const { canModifyQueue } = require("../../util/Music/Music_defaults");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "resume",
			group: "music",
			memberName: "music-command-0vsxcadvsdva",
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

		if (!queue.playing) {
			queue.playing = true;
			queue.connection.dispatcher.resume();
			return queue.textChannel
				.send(`${message.author} ▶ resumed the music!`)
				.catch(console.error);
		}

		return message.reply("The queue is not paused.").catch(console.error);
	}
};
