const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const profileSchema = require("../../db/profile");
const ms = require("ms");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "work",
			// aliases: [""],
			group: "economy",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "work_command",
			description: "Work to earn more money.",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		let target = message.author;
		let userId = target.id;
		try {
			let data = await profileSchema.findOne({
				userId: userId,
			});

			if (!data) {
				let newData = await profileSchema.create({
					userId: target.id,
					job: "Unemployed",
					bank: 0,
					wallet: 0,
					multiplier: 0,
					inventory: [Object],
					dailyCooldown: Date.now(),
					workCooldown: Date.now(),
					weeklyCooldown: Date.now(),
					monthlyCooldown: Date.now(),
					hourlyCooldown: Date.now(),
					begCooldown: Date.now(),
					robCooldown: Date.now(),
					bankRobCooldown: Date.now(),
				});

				data = newData;
			}

			if (data.job === "Unemployed")
				return message.reply("You must be employed to work.");
			else if (data.workCooldown > Date.now()) {
				let timeLeft = Date.parse(data.workCooldown) - Date.now();

				let hours = Math.floor(
					Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (100 * 60 * 60)) / 10
				);
				let minutes = Math.floor(
					Math.floor((timeLeft % (1000 * 60 * 60)) / (100 * 60)) / 10
				);
				let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

				return message.reply(
					`You must wait **${hours} hours, ${minutes} minutes, ${seconds} seconds** before working again!`
				);
			} else {
				await profileSchema.findOneAndUpdate(
					{
						userId: userId,
					},
					{
						userId: userId,
						workCooldown: Date.now() + ms("1.5 hrs"),
					}
				);

				let hours = Math.floor(Math.random() * 12) + 1;
				let paycheck = (Math.floor(Math.random() * 1500) + 1) * data.multiplier;
				let roundedPaycheck = Math.floor(paycheck * 100) / 100;

				let currentWallet = data.wallet;

				let afterWork = await profileSchema.findOneAndUpdate(
					{
						userId: userId,
					},
					{
						userId: userId,
						wallet: currentWallet + roundedPaycheck,
					},
					{
						upsert: true,
					}
				);

				return message.reply(
					`You worked ${hours} hours as a ${
						afterWork.job
					} and gained $${formatNumber(
						roundedPaycheck
					)}. You now have $${formatNumber(
						afterWork.wallet + roundedPaycheck
					)} in your wallet.`
				);
			}
		} catch (e) {
			console.log(e);
			message.channel.send(
				`An error has occurred: ${e.message}\nUsually this happens once, please try again.`
			);
		}
	}
};
function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
