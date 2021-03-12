const Discord = require("discord.js");
const commando = require("discord.js-commando");
const profileSchema = require("../../db/profile");
const ms = require("ms");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "beg",
			// aliases: [""],
			group: "economy",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "",
			description: "",
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
					userId: userId,
					job: "Unemployed",
					bank: 0,
					wallet: 0,
					multiplier: 1,
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

			if (data.begCooldown > Date.now()) {
				let timeLeft = Date.parse(data.begCooldown) - Date.now();

				let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

				return message.reply(
					`You must wait **${seconds} seconds** before begging again!`
				);
			} else {
				await profileSchema.findOneAndUpdate(
					{
						userId: userId,
					},
					{
						userId: userId,
						begCooldown: Date.now() + ms("1m"),
					}
				);

				let currentWallet = data.wallet;

				let yesno = Math.floor(Math.random() * 4);
				let begornobeg;

				if (yesno === 3) begornobeg = true;
				else if (yesno < 3) begornobeg = false;

				if (begornobeg === true) {
					let coinsEarned = Math.floor(Math.random() * 150 * data.multiplier);
					let roundedCoins = Math.floor(coinsEarned * 100) / 100;

					await profileSchema.findOneAndUpdate(
						{
							userId: userId,
						},
						{
							userId: userId,
							wallet: currentWallet + roundedCoins,
						},
						{
							upsert: true,
						}
					);
					//helper
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

					const randomPeople =
						people[Math.floor(Math.random() * people.length)];

					const randomNumber = Math.round(Math.random() * 250);

					const response = [
						`**${randomPeople}** finally gave ${
							message.member
						} **${formatNumber(roundedCoins)}** bits.`,
						`**${randomPeople}** gave ${message.member} **${formatNumber(
							roundedCoins
						)}** bits.`,
						`**${randomPeople}** threw **${formatNumber(
							roundedCoins
						)}** bits at **${message.member}**`,
						`**${randomPeople}** felt bad. They gave **${formatNumber(
							roundedCoins
						)}** bits to ${message.member}.`,
						`But...But...MOM!...Its not my fault **${
							message.member
						}** is homeless...fine! Here take **${formatNumber(
							roundedCoins
						)}** bits you scum...`,
					];

					const lastResponse =
						response[Math.floor(Math.random() * response.length)];

					message.channel.send(`${lastResponse}`);
				} else if (begornobeg === false) {
					return message.reply("No, go away.");
				}
			}
		} catch (err) {
			console.error(err);
			message.channel.send(
				`An error occurred: ${err.message}\nUsually this happens once, please try again.`
			);
		}
	}
};

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
