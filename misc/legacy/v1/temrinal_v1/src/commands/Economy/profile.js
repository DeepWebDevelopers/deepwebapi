const mongo = require("../../mongo");
const profileSchema = require("../../db/profile");
const Discord = require("discord.js");

module.exports = {
	name: "profile",
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: "[mention]",
	description: "Display your economy profile",
	category: "Economy",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const target = message.mentions.users.first() || message.author;
		const userId = target.id;

		await mongo().then(async (mongoose) => {
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

				const embed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle(`${target.tag}'s profile`)
					.addFields(
						{
							name: "Current job",
							value: `${data.job}`,
						},
						{
							name: "Coin balance",
							value: `\nWallet: $${formatNumber(
								data.wallet
							)}\nBank: $${formatNumber(data.bank)}`,
						},
						{
							name: "Coin multiplier",
							value: `${data.multiplier}`,
						},
						{
							name: "Inventory item count",
							value: `${formatNumber(data.inventory.length)} items`,
						}
					)
					.setThumbnail(
						target.displayAvatarURL({
							format: "png",
							dynamic: true,
						})
					)
					.setTimestamp();

				return message.channel.send(embed);
			} catch (e) {
				console.log(e);
				message.channel.send(
					`An error occurred: ${e.message}\nUsually this happens once, please try again.`
				);
			}
		});
	},
};

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
