const commando = require("discord.js-commando");
const request = require("node-superfetch");
const cheerio = require("cheerio");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "food",
			aliases: [
				"this-food-does-not-exist",
				"this-snack-does-not-exist",
				"ai-snack",
				"ai-food",
				"snack",
			],
			group: "images",
			memberName: "images",
			description: "Responds with a randomly generated food.",
			credit: [
				{
					name: "This Snack Does Not Exist",
					url: "https://thissnackdoesnotexist.com/",
					reason: "API",
				},
			],
		});
	}

	async run(msg) {
		try {
			const { text } = await request.get("https://thissnackdoesnotexist.com/");
			const $ = cheerio.load(text);
			const img = $('div[class="Absolute-Center"]')
				.first()
				.attr("style")
				.match(/background-image:url\((.+)\);/i);
			const name = $('h1[class="snack-description"]').first().text();
			return msg.say(
				name,
				img ? { files: [{ attachment: img[1], name: "ai-food.jpg" }] } : {}
			);
		} catch (err) {
			return msg.reply(
				`Oh no, an error occurred: \`${err.message}\`. Try again later!`
			);
		}
	}
};
