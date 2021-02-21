const { MessageEmbed } = require("discord.js");
const commando = require("discord.js-commando");
const currencyFunctions = require("../../util/eco/currencyFunctions");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "deposit",
			aliases: ["dep"],
			group: "economy",
			memberName: ".deposite-command",
			description: "..",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 20,
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
			if (data.coins > data.bankSpace) {
				data.coins = data.coins - (data.bankSpace - data.coinsInBank);

				const depEmbed2 = new MessageEmbed()
					.setDescription(
						`${message.author.username} has Deposited **${args[0]}** coins into their account.`
					)
					.setColor("#e7e7e7")
					.setTimestamp();
				await message.channel.send(depEmbed2);

				data.coinsInBank += data.bankSpace - data.coinsInBank;

				await data.save();
			} else {
				data.coinsInBank += data.coins;

				const depEmbed3 = new MessageEmbed()
					.setDescription(
						`${message.author.username} has Deposited **${args[0]}** coins into there account.`
					)
					.setColor("#e7e7e7")
					.setTimestamp();
				await message.channel.send(depEmbed3);

				data.coins -= data.coins;

				await data.save();
			}
		} else {
			if (isNaN(args[0])) {
				return message.channel.send(
					"You need to give an amount or say `deposit all`"
				);
			}

			if (parseInt(args[0]) > data.bankSpace) {
				return message.channel.send(
					"Your bank is not big enough. To increase it run `bank`"
				);
			}

			data.coinsInBank += parseInt(args[0]);

			const depEmbed = new MessageEmbed()
				.setDescription(
					`${message.author.username} has Deposited **${args[0]}** coins into there account.`
				)
				.setColor("#e7e7e7")
				.setTimestamp();
			await message.channel.send(depEmbed);

			data.coins -= parseInt(args[0]);

			await data.save();
		}
	}
};
