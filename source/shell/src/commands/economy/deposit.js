const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const profileSchema = require("../../db/profile");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "deposit",
			aliases: ["dep"],
			group: "economy",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "deposit_command",
			description: "..",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 15,
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

			let currentWallet = data.wallet;
			let currentBank = data.bank;

			let toDeposit = parseInt(args[0]);
			if (isNaN(toDeposit))
				return message.channel.send(
					`Please provide a numerical value. Run: **${prefix}bal** to check.`
				);

			if (toDeposit == 0) return message.reply("You cant deposit nothing...");

			if (toDeposit > data.wallet)
				return message.reply("You don't have that many coins in your wallet!");

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
	}
};

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
