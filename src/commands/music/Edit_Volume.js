const commando = require("discord.js-commando");
const { canModifyQueue } = require("../../util/Music/Music_defaults");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "volume",
			aliases: ["vol", "sound"],
			group: "music",
			memberName: "musisc-command-0awdawd",
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
		if (!canModifyQueue(message.member))
			return message
				.reply("You need to join a voice channel first!")
				.catch(console.error);

		if (!args[0])
			return message
				.reply(`🔊 The current volume is: **${queue.volume}%**`)
				.catch(console.error);
		if (isNaN(args[0]))
			return message
				.reply("Please use a number to set volume.")
				.catch(console.error);
		if (Number(args[0]) > 100 || Number(args[0]) < 0)
			return message
				.reply("Please use a number between 0 - 100.")
				.catch(console.error);

		queue.volume = args[0];
		queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

		return queue.textChannel
			.send(`Volume set to: **${args[0]}%**`)
			.catch(console.error);
	}
};
