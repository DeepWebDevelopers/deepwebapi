const commando = require("discord.js-commando");
const currencyFunctions = require("../../util/eco/currencyFunctions");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "give",
			group: "economy",
			memberName: "..eco-give",
			description: "..",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 30,
			},
		});
	}
	async run(message, args) {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find(
				(member) =>
					member.user.username === args.join(" ") ||
					member.user.username === args[0]
			);

		const amount = args[1];

		if (!member) {
			return message.channel.send("Please provide a user.");
		}

		if (member.id === message.author.id) {
			return message.channel.send("You can't give coins to yourself!");
		}

		if (!amount) {
			return message.channel.send("Please provide an amount.");
		}

		if (isNaN(amount)) {
			return message.channel.send("The amount must be a number");
		}

		let sender = await currencyFunctions.findUser(
			message.author.id,
			message.guild.id
		);
		let reciever = await currencyFunctions.findUser(member.id, member.guild.id);

		if (parseInt(amount) > sender.coins) {
			return message.channel.send(
				`You don't have \`${amount}\` coins to give!`
			);
		}

		sender.coins -= parseInt(amount);

		await message.channel.send(
			`${message.member} gave ${member} **${parseInt(
				amount
			).toLocaleString()}** coins.`
		);

		reciever.coins += parseInt(amount);

		await sender.save();
		await reciever.save();
	}
};
