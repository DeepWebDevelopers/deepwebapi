const Discord = require("discord.js");
const npm = require("search-npm-registry");
const moment = require("moment");
const { stripIndents } = require("common-tags");
module.exports = {
	name: "npm",
	aliases: ["nodedocs", "npmsr"],
	minArgs: 0,
	maxArgs: 0,
	expectedArgs: "<query>",
	cooldown: "10s",
	description: "Checks how long the bot has been running for.",
	category: "Fun & Games",
	run: async ({ message, args, text, client, prefix, instance }) => {
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
	},
};
