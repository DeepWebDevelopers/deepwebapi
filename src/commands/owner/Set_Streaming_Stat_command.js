const commando = require("discord.js-commando");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "set-streaming-stat",
			group: "owner",
			memberName: "awdaasdwdad",
			description: "..",
			argsType: "multiple",
			ownerOnly: true,
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 45,
			},
		});
	}
	async run(message, args) {
		const Discord = require("discord.js");
		const client = new Discord.Client();

		if (!args[0]) return message.reply("I need a message to set as playing.");

		if (args.join(" ").length > 100)
			return message.reply("That is too long of a message to set.");
		message.client.user.setActivity(args.join(" "), { type: "STREAMING" });
		message.react("✅");
	}
};
