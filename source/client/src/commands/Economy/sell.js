const mongo = require("../../mongo");
const profileSchema = require("../../db/profile");

module.exports = {
	name: "sell",
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<item name>",
	description: "Sell an item to the shop",
	category: "Economy",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let target = message.author;
		let userId = target.id;
		const Items = [
			{
				name: "Banana",
				cost: 30,
				worth: 20,
			},
			{
				name: "Apple",
				cost: 30,
				worth: 20,
			},
			{
				name: "Orange",
				cost: 30,
				worth: 20,
			},
			{
				name: "Coffee",
				cost: 60,
				worth: 40,
			},
			{
				name: "Iced Tea",
				cost: 60,
				worth: 40,
			},
			{
				name: "Soda",
				cost: 90,
				worth: 60,
			},
			{
				name: "Ice Cream",
				cost: 150,
				worth: 100,
			},
			{
				name: "Cookie",
				cost: 120,
				worth: 80,
			},
			{
				name: "Cake",
				cost: 180,
				worth: 120,
			},
			{
				name: "Basketball",
				cost: 600,
				worth: 400,
			},
			{
				name: "Soccer Ball",
				cost: 600,
				worth: 400,
			},
			{
				name: "Football",
				cost: 600,
				worth: 400,
			},
			{
				name: "BB Gun",
				cost: 2500,
				worth: 2000,
			},
			{
				name: "RC Car",
				cost: 3500,
				worth: 3000,
			},
			{
				name: "RC Drone",
				cost: 5000,
				worth: 4000,
			},
			{
				name: "Phone",
				cost: 10000,
				worth: 6000,
			},
			{
				name: "Laptop",
				cost: 20000,
				worth: 12000,
			},
			{
				name: "Smart Watch",
				cost: 7500,
				worth: 5000,
			},
			{
				name: "Headphones",
				cost: 5000,
				worth: 3000,
			},
			{
				name: "Music Player",
				cost: 6500,
				worth: 4000,
			},
			{
				name: "Virtual Reality Headset",
				cost: 12500,
				worth: 8000,
			},
			{
				name: "Tablet",
				cost: 15000,
				worth: 10000,
			},
			{
				name: "Gaming PC",
				cost: 50000,
				worth: 40000,
			},
			{
				name: "Game Console",
				cost: 10000,
				worth: 5000,
			},
			{
				name: "Game Controller",
				cost: 3000,
				worth: 1000,
			},
			{
				name: "N-Word Pass",
				cost: 69420,
				worth: 1,
			},
			{
				name: "Guinea Pig",
				cost: 100000,
				worth: 95000,
			},
			{
				name: "Expensive Air",
				cost: 1000000,
				worth: 0,
			},
		];

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
				let chosenItem = args.slice(0).join(" ");

				for (let i = 0; i < Items.length; i++) {
					if (chosenItem === Items[i].name.toLowerCase()) {
						await profileSchema.findOneAndUpdate(
							{
								userId: userId,
							},
							{
								userId: userId,
								wallet: currentWallet + Items[i].worth,
								$pull: {
									inventory: Items[i],
								},
							},
							{
								upsert: true,
							}
						);

						return message.reply(
							`Successfully sold 1 **${Items[i].name}** for ${formatNumber(
								Items[i].worth
							)} coins.\nYou now have ${formatNumber(
								currentWallet + Items[i].worth
							)} coins in your wallet.`
						);
					}
				}
				return message.reply(
					`Could not find a **${chosenItem}** in the shop.\nMake sure you entered your choice case sensitive!`
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
