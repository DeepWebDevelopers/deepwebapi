const commando = require("discord.js-commando");
const userConfig = require("../../db/economy");
const currencyFunctions = require("../../util/eco/currencyFunctions");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "beg",
			group: "economy",
			memberName: "efs",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			description: "..",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 300, //! 5min
			},
		});
	}
	async run(message, args) {
		let data = await currencyFunctions.findUser(
			message.author.id,
			message.guild.id
		);

		if (!data) {
			await message.reply(
				"I could not find you in my database, I have added you now!"
			);

			const newData = new userConfig({
				userId: member.id,
				guildId: member.guild.id,
			});
			newData.save();
			return;
		}

		const people = [
			"Hamidreza Dashtipour",
			"Poryafm12",
			"Gavin",
			"Elon Musk",
			"ur mom",
			"your stepsister",
			"Proxy",
			"Onyx",
			"Hcgx3",
			"annie",
			"reffu",
			"zeto",
			"noah",
			"zed",
			"mu'pha",
			"dan",
			"petter",
			"ziro",
			"dad",
			"step sister",
		];

		const randomPeople = people[Math.floor(Math.random() * people.length)];

		const randomNumber = Math.round(Math.random() * 250);

		await currencyFunctions.giveCoins(
			message.author.id,
			message.guild.id,
			randomNumber
		);

		const response = [
			`**${randomPeople}** finally gave ${message.member} **${randomNumber}** coins.`,
			`**${randomPeople}** gave ${message.member} **${randomNumber}** coins.`,
			`**${randomPeople}** threw **${randomNumber}** coins at **${message.member}**`,
			`**${randomPeople}** felt bad. They gave **${randomNumber}** coins to ${message.member}.`,
			`Its not my fault **${message.member}** is homeless...fine mom! Here take **${randomNumber}** coins you scum...`,
		];

		const lastResponse = response[Math.floor(Math.random() * response.length)];

		message.channel.send(`${lastResponse}`);
	}
};
