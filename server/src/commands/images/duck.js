const request = require("node-superfetch");
const commando = require("discord.js-commando");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "duck",
			aliases: ["ducky", "quack"],
			group: "images",
			memberName: "duck",
			description: "Responds with a random duck image.",
			clientPermissions: ["ATTACH_FILES"],
			credit: [
				{
					name: "Random-d.uk",
					url: "https://random-d.uk/",
					reason: "API",
					reasonURL: "https://random-d.uk/api",
				},
			],
		});
	}

	async run(msg) {
		try {
			const { body } = await request.get("https://random-d.uk/api/v1/random");
			return msg.say({ files: [body.url] });
		} catch (err) {
			return msg.reply(
				`Oh no, an error occurred: \`${err.message}\`. Try again later!`
			);
		}
	}
};
