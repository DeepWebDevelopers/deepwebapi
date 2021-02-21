const commando = require("discord.js-commando");
const { canModifyQueue } = require("../../util/Music/Music_defaults");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "skip-to-song",
			aliases: ["skip-to", "skipto"],
			group: "music",
			memberName: "mu23sic-command-0sefes",
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
		if (!args.length || isNaN(args[0]))
			return message
				.reply(
					`Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`
				)
				.catch(console.error);

		const queue = message.client.queue.get(message.guild.id);
		if (!queue)
			return message.channel.send("There is no queue.").catch(console.error);
		if (!canModifyQueue(message.member)) return;
		if (args[0] > queue.songs.length)
			return message
				.reply(`The queue is only ${queue.songs.length} songs long!`)
				.catch(console.error);

		queue.playing = true;

		if (queue.loop) {
			for (let i = 0; i < args[0] - 2; i++) {
				queue.songs.push(queue.songs.shift());
			}
		} else {
			queue.songs = queue.songs.slice(args[0] - 2);
		}

		queue.connection.dispatcher.end();
		queue.textChannel
			.send(`${message.author} ⏭ skipped ${args[0] - 1} songs`)
			.catch(console.error);
	}
};
