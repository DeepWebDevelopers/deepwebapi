const commando = require("discord.js-commando");
const Discord = require("discord.js");
const npm = require("search-npm-registry");
const moment = require("moment");
const { stripIndents } = require("common-tags");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "npm",
			aliases: ["npmdocs", "npmsr"],
			group: "other",
			memberName: "npm-search-command",
			description: "Search the npm docs for packages.",
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: false,
			nsfw: false,
			throttling: {
				usages: 3,
				duration: 18,
			},
		});
	}
	async run(message, args) {
		// Variables
		const argsNPM = args.join(" ");

		// Input Checking
		(async () => {
			if (!argsNPM)
				return message.channel.send(
					`😵 **Please specify something that you want to search in the NPM library!**`
				);

			const results = await npm().text(argsNPM).size(5).search();
			if (!results || results.length < 1)
				return message.reply(
					"Failed to find anything using the specified query in NPM library. Please try again."
				);

			// Executing
			const result = results[0];
			const maintainers = [];
			for (let i = 0; i < results[0].maintainers.length; i++) {
				maintainers.push(results[0].maintainers[i].username);
			}

			const em = new Discord.MessageEmbed()
				.setAuthor(
					result.name,
					"https://i.imgur.com/24yrZxG.png",
					"https://www.npmjs.com/"
				)
				.setColor("ORANGE").setDescription(stripIndents`
        ${result.description ? result.description : null}
        :up: Version: ${result.version}
        :bust_in_silhouette: Author: ${result.publisher.username}
        :alarm_clock: Modified: ${moment(result.date).fromNow()}
        :busts_in_silhouette: Maintainers: ${maintainers.join(", ")}
        Keywords: ${
					result.keywords && result.keywords.length > 0
						? result.keywords.map((k) => `\`${k}\``).join(", ")
						: "none"
				}
        Download: [${result.name}](${result.links.npm})
        `);
			return message.channel.send(em);
		})();
	}
};
