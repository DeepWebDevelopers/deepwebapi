const commando = require("discord.js-commando");
const { canModifyQueue } = require("../../util/Music/Music_defaults");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "leave",
			aliases: ["end", "stop"],
			group: "music",
			memberName: "mu23sic-commasdand-0sefes",
			description: "..",
			userPermissions: ["CONNECT", "VIEW_CHANNEL", "MOVE_MEMBERS"],
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

		queue.songs = [];
		queue.connection.dispatcher.end();
		queue.textChannel
			.send(`${message.author} ⏹ stopped the music!`)
			.catch(console.error);
		await message.react("✅");
	}
};
