const commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const currencyFunctions = require("../../util/eco/currencyFunctions");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "withdraw",
			aliases: ["with"],
			group: "economy",
			memberName: "with-command-draw3029",
			description: "..",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 35,
			},
		});
	}
	async run(message, args) {
		let data = await currencyFunctions.findUser(
			message.author.id,
			message.guild.id
		);

		if (!data) {
			return message.channel.send(
				"You are not in my data-base. Run the `balence` command to get added."
			);
		}

		if (args.join(" ") === "all") {
			data.coins += data.coinsInBank;

			const withEmbed2 = new MessageEmbed()
				.setDescription(
					`${message.author.username} has Withdrawed **${args[0]}** coins into there wallet.`
				)
				.setColor("#e7e7e7")
				.setTimestamp();
			await message.channel.send(withEmbed2);

			data.coinsInBank -= data.coinsInBank;

			await data.save();
		} else {
			if (isNaN(args[0])) {
				return message.channel.send(
					"You need to give an amount or say `withdraw all`"
				);
			}

			if (parseInt(args[0]) > data.coinsInBank) {
				return message.channel.send("You do not have that much coins.");
			}

			data.coins += parseInt(args[0]);

			await message.channel.send(`Withdrawed **${args[0]}** coins.`);
			const withEmbed = new MessageEmbed()
				.setDescription(
					`${message.author.username} has Withdrawed **${args[0]}** coins into there wallet.`
				)
				.setColor("#e7e7e7")
				.setTimestamp();
			await message.channel.send(withEmbed);

			data.coinsInBank -= parseInt(args[0]);

			await data.save();
		}
	}
};
