const mongo = require("../../mongo");
const profileSchema = require("../../db/profile");

module.exports = {
	name: "pay",
	aliases: ["give"],
	minArgs: 2,
	maxArgs: 2,
	expectedArgs: "<mention> <amount>",
	description: "Give someone else money",
	category: "Economy",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const target1 = message.author;
		const target2 = message.mentions.members.first();

		if (target1 === target2)
			return message.reply("You cannot give coins to yourself!");

		const userId1 = target1.id;
		const userId2 = target2.id;

		await mongo().then(async (mongoose) => {
			try {
				let data1 = await profileSchema.findOne({
					userId: userId1,
				});
				let data2 = await profileSchema.findOne({
					userId: userId2,
				});

				if (!data1) {
					let newData1 = await profileSchema.create({
						userId: userId1,
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

					data1 = newData1;
				}

				if (!data2) {
					let newData2 = await profileSchema.create({
						userId: userId2,
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

					data2 = newData2;
				}

				let currentWallet1 = data1.wallet;
				let currentWallet2 = data2.wallet;

				let amount = parseFloat(args[1]);
				let roundedAmount = Math.floor(amount * 100) / 100;

				if (roundedAmount > currentWallet1)
					return message.reply(
						"You don't have that many coins in your wallet!"
					);

				await profileSchema.findOneAndUpdate(
					{
						userId: userId1,
					},
					{
						userId: userId1,
						wallet: currentWallet1 - roundedAmount,
					},
					{
						upsert: true,
					}
				);

				await profileSchema.findOneAndUpdate(
					{
						userId: userId2,
					},
					{
						userId: userId2,
						wallet: currentWallet2 + roundedAmount,
					},
					{
						upsert: true,
					}
				);

				return message.channel.send(
					`**From:** ${target1}\n**To:** ${target2}\n**Amount:** ${formatNumber(
						roundedAmount
					)}`
				);
			} catch (err) {
				console.log(err);
				message.channel.send(
					`An error occurred: \`${err.message}\`\nUsually this happens once, please try again.`
				);
			}
		});
	},
};

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
