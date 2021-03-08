const mongo = require("../../mongo");
const profileSchema = require("../../db/profile");
const ms = require("ms");

module.exports = {
	name: "beg",
	minArgs: 0,
	maxArgs: 0,
	description: "beg for some coins",
	category: "Economy",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let target = message.author;
		let userId = target.id;

		await mongo().then(async (mongoose) => {
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

						return message.reply(
							`\nI gave you $${formatNumber(
								roundedCoins
							)}.\nNow leave me alone.`
						);
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
		});
	},
};

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
