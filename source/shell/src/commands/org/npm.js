const npm = require("search-npm-registry");
const moment = require("moment");
const { stripIndents } = require("common-tags");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "npm",
			aliases: ["nodedocs", "npmsr"],
			group: "org",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "npm_search_command",
			description: "search the npm website for packages",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;
	
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
