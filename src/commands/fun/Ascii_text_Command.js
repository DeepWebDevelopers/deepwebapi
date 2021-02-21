const commando = require("discord.js-commando");
const figlet = require("figlet");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "ascii",
			group: "fun",
			memberName: "ascii",
			description: "Puts any text in ascii format",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, msg) {
		if (!args[0]) return message.channel.send("Please provide some text");

		msg = args.join(" ");

		figlet.text(msg, function (err, data) {
			if (err) {
				console.log("Something went wrong");
				console.dir(err);
			}
			if (data.length > 2000)
				return message.channel.send(
					"Please provide text shorter than 2000 characters"
				);

			message.channel.send("```" + data + "```");
		});
	}
};
