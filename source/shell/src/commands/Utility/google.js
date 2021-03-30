const request = require("node-superfetch");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "google",
			aliases: ["ggl"],
			group: "util",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "google_util_command",
			description: "Google something",
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: true,
			throttling: {
				usages: 2,
				duration: 35,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		let config_key = {
			GOOGLE_API_KEY: config.google_api_key,
		};

		let csx = "5ab753db481f5a6f4";
		let query = args.join(" ");

		if (!query) return message.channel.send("Please enter the search query.");
		let href = await search(query);
		if (!href) return message.channel.send("Unknown search.");

		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(href.title)
			.setDescription(href.snippet)
			.setImage(href.pagemap ? href.pagemap.cse_thumbnail[0].src : null)
			.setURL(href.link)
			.setFooter("Powered by Google")
			.setTimestamp();

		return message.channel.send(embed);

		async function search(query) {
			const { body } = await request
				.get("https://www.googleapis.com/customsearch/v1")
				.query({
					key: config_key.GOOGLE_API_KEY,
					cx: csx,
					safe: "off",
					q: query,
				});

			if (!body.items) return null;
			return body.items[0];
		}
	}
};
