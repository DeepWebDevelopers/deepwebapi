const fetch = require("node-fetch");
module.exports = {
	name: "docs",
	aliases: ["docjs", "discordjs"],
	requiredPermissions: ["MANAGE_ROLES"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<search> ",
	description:
		"Quickly fetches data from the discordjs docs and sends them to the channel.",
	category: "Org",
	run: async ({ message, args, text, client, prefix, instance }) => {
		var [query, branch] = args;

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
	},
};
