const commando = require("discord.js-commando");
const { canModifyQueue } = require("../../util/Music/Music_defaults");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "qremove",
			aliases: ["queue-remove", "q-subtract"],
			group: "music",
			memberName: "music-commaawdnd-afdcas0",
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
			return message.channel.send("There is no queue.").catch(console.error);
		if (!canModifyQueue(message.member)) return;

		if (!args.length)
			return message.reply(
				`Usage: ${message.client.prefix}remove <Queue Number>`
			);
		if (isNaN(args[0]))
			return message.reply(
				`Usage: ${message.client.prefix}remove <Queue Number>`
			);

		const song = queue.songs.splice(args[0] - 1, 1);
		queue.textChannel.send(
			`${message.author} ❌ removed **${song[0].title}** from the queue.`
		);
	}
};
