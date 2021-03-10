const currencyFunctions = require("../../util/eco/currencyFunctions");
const userConfig = require("../../db/economy");
const commando = require("discord.js-commando");
const Discord = require("discord.js");

const { MessageEmbed } = require("discord.js");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "remove-balence",
			aliases: ["rbal", "take-money", "subtract-bal", "rebal"],
			group: "economy",
			memberName: "efsdwq",
			userPermissions: ["ADMINISTRATOR"],
			clientPermissions: ["SEND_MESSAGES"],
			description: "..",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 75,
			},
		});
	}
	async run(message, args) {
		const member = message.mentions.members.first() || message.member;
		const prefix = require("../../config.json");
		const amount = args[1];
		const coins = await userConfig
			.find({ guildId: message.guild.id })
			.sort([["coins"]])
			.exec();

		const user = await currencyFunctions.findUser(member.id, message.guild.id);
		const inDb = await currencyFunctions.deductCoins(
			member.id,
			member.guild.id,
			amount
		);

		if (!amount) {
			return message.channel.send(
				`❌ You did not give an amount. Usage: \`${prefix.prefix}remove-bal <@user> <amount>\``
			);
		} else if (isNaN(amount)) {
			return message.channel.send("The amount must be a number!");
		} else if (amount <= 0) {
			return message.channel.send("The number must be higher than 0.");
		} else if (amount.coins > args[1]) {
			return message.reply(`They dont have \`${args[1]}\` coins to remove!`);
		} else if (!member) {
			return message.reply(`❌ You need to mention someone!`);
		} else if (!user) {
			return message.reply("❌ You are not in my database!");
		} else if (inDb) {
			return message.channel.send(
				`Sorry *${member}*, **$${amount}** has been removed from you bank.`
			);
		}
	}
};
