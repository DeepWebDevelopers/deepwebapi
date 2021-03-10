module.exports = {
	name: "set-verification",
	aliases: "setvv",
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<channel>",
	description: "Sets the server verification channel.",
	category: "Bot Owner",
	testOnly: true,
	guildOnly: true,
	run: async ({ message, args, text, client, prefix, instance }) => {
		message.reply("Command coming soon.");
	},
};
