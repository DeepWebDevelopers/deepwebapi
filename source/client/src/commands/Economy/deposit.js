const mongo = require("../../mongo");
const profileSchema = require("../../db/profile");

module.exports = {
	name: "deposit",
	aliases: ["dep"],
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: "<amount of coins>",
	description: "Deposit coins into the bank",
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

				let currentWallet = data.wallet;
				let currentBank = data.bank;

				let toDeposit = parseInt(args[0]);
				if (isNaN(toDeposit))
					return message.channel.send("Please provide a numerical value.");

				if (toDeposit > data.wallet)
					return message.reply(
						"You don't have that many coins in your wallet!"
					);

				await profileSchema.findOneAndUpdate(
					{
						userId: userId,
					},
					{
						userId: userId,
						wallet: currentWallet - toDeposit,
						bank: currentBank + toDeposit,
					},
					{
						upsert: true,
					}
				);

				return message.reply(
					`Successfully deposited **${formatNumber(
						args[0]
					)}** coins into the bank.`
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
