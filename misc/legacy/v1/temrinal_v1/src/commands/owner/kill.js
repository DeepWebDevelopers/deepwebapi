module.exports = {
	name: "kill",
	aliases: ["destroy"],
	minArgs: 0,
	maxArgs: 0,
	description: "Shut down the bot, restart if hosted on heroku",
	category: "Bot Owner",
	ownerOnly: true,
	run: async ({ message, args, text, client, prefix, instance }) => {
		//Filter the person to respond to the message author, me
		const filter = (msg) => msg.author.id === message.author.id;
		const options = {
			max: 1,
		};

		message.channel.send(instance.messageHandler.get(message.guild, "SURE?"));

		let collector = await message.channel.awaitMessages(filter, options);
		let answer = collector.first().content;

		if (
			answer === "cancel" ||
			answer === "Cancel" ||
			answer === "no" ||
			answer === "No" ||
			answer === "NO"
		) {
			message.channel.send(
				instance.messageHandler.get(message.guild, "KILL_ENDED")
			);
			return;
		}

		if (answer === "yes" || answer === "Yes" || answer === "YES") {
			console.log(`Logged out of [${client.user.tag}]`);
			message.channel.send(
				instance.messageHandler.get(message.guild, "SHUT_DOWN")
			);

			//After 3 seconds, the bot will automatically shut down, if the bot is hosted on heroku, it restarts instead
			setTimeout(() => {
				client.destroy();
				process.exit();
			}, 3000);
		}
	},
};
