const shell = require("shelljs");

module.exports = {
	name: "restart",
	minArgs: 0,
	maxArgs: 0,
	ownerOnly: true,
	description: "Reloads the bot",
	category: "Bot Owner",
	run: async ({ message, prefix, client }) => {
		message.channel.send("The bot is restarting in 3 seconds...").then(() => {
			setTimeout(() => {
				client.destroy();
				shell.exec("yarn demon");
			}, 3000);
		});
	},
};
