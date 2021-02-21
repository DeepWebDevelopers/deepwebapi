const Commando = require("discord.js-commando");
const fetch = require("node-fetch");
const commando = require("discord.js-commando");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "docs",
			aliases: ["discord-docs"],
			group: "other",
			memberName: "discord-docs-comamnd",
			description: "Lets a user see the discord js docs.",

			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 4,
				duration: 20,
			},
		});
	}
	async run(message, args) {
		let [query, branch] = args;

		if (!query) return message.channel.send("Please include a search query!");
		if (!branch) branch = "master";

		fetch(
			`https://djsdocs.sorta.moe/v2/embed?src=${branch}&q=${encodeURIComponent(
				query
			)}`
		)
			.then((res) => res.json())
			.then((json) => {
				if (!json) return message.channel.send("Not found!");

				message.channel.send({ embed: json });
			})
			.catch(() => {
				message.channel.send("Couldn't fetch docs!");
			});
	}
};
