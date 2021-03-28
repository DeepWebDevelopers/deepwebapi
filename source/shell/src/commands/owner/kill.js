const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "kill",
			aliases: ["destroy"],
			group: "owner",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "kill_bot_command",
			description: "shuts down the bot",
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;
	
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
	}
};
