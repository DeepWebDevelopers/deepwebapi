const commando = require("discord.js-commando");
module.exports = class TestCommand extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "dev",
			aliases: ["test"],
			group: "test",
			memberName: "testcommand",
			description: "Testing something out...",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: true,
			nsfw: false,
			throttling: {
				usages: 3,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		if (!args.length)
			return message.reply("😵 Please specify a destination channel id.");
		const content = args.join(" ");
		message.client.shard
			.broadcastEval(
				`
			const channel = this.channels.cache.get('${args[0]}');
			if (channel) {
				channel.send('This is a message from \`shard ${message.client.shard.ids.join(
					","
				)}!\` ${content}');
				true;
			}
			else {
				false;
			}
		`
			)
			.then(message.reply("I have successfully sent the message!"));
	}
};
