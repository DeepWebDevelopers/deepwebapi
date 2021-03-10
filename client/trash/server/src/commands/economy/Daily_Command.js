const commando = require("discord.js-commando");
const currencyFunctions = require("../../util/eco/currencyFunctions");
const userConfig = require("../../db/economy");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "daily",
			group: "economy",
			memberName: "daily-command-command",
			description: "",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 60,
			},
		});
	}
	async run(message, args) {
		const data = await currencyFunctions.findUser(
			message.author.id,
			message.guild.id
		);

		const { MessageEmbed } = require("discord.js");
		const prettyMilliseconds = require("pretty-ms");

		const now = Date.now();

		if (!data) return;

		if (now - data.daily + Date.now() < Date.now() + 1) {
			const underTime = new MessageEmbed()
				.setTitle("Cooldown")
				.setDescription(
					`This command is on a cooldown, try again in \`${prettyMilliseconds(
						86400000 - (now - data.daily + 86400000)
					)}\`.\n\nThe default cooldown on this command is \`24h\`.`
				)
				.setColor("RANDOM");
			return message.channel.send(underTime);
		} else if (now - data.daily + Date.now() > Date.now() + 1) {
			const randomNumber = Math.round(Math.random() * 1000);
			const overTime = new MessageEmbed()
				.setTitle(`${randomNumber} Coins were placed in your Wallet`)
				.setDescription("Come back in 24 hours to claim more coins!")
				.setColor("RANDOM");
			message.channel.send(overTime);
			await currencyFunctions.giveCoins(
				message.author.id,
				message.guild.id,
				randomNumber
			);
			data.daily = Date.now() + 86400000;

			await data.save();
		}
	}
};
