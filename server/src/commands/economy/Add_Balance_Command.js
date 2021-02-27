const commando = require("discord.js-commando");
const Discord = require("discord.js");
const userConfig = require("../../db/economy");
const { MessageEmbed } = require("discord.js");
const currencyFunctions = require("../../util/eco/currencyFunctions");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "add-balance",
			aliases: ["addbal", "set-bal", "setbal"],
			group: "economy",
			memberName: "..",
			description: "..",
			userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		const member = message.mentions.members.first() || message.member;
		const prefix = message.guild.commandPrefix;
		const amount = args[1];

		const user = await currencyFunctions.findUser(member.id, message.guild.id);
		const inDb = await currencyFunctions.giveCoins(
			member.id,
			member.guild.id,
			amount
		);

		if (!amount) {
			return message.channel.send(
				`❌ You did not give an amount. Usage: \`${prefix}addbal <@user> <amount>\``
			);
		} else if (isNaN(amount)) {
			return message.channel.send("The amount must be a number!");
		} else if (amount < 0) {
			return message.channel.send("The number must be higher than 0.");
		} else if (!member) {
			return message.reply(`❌ You need to mention someone!`);
		} else if (!user) {
			return message.reply("❌ You are not in my database!");
		} else if (inDb) {
			return message.channel.send(
				`Yay! *${member}*, **$${amount}** has been added to your bank.`
			);
		}
	}
};
