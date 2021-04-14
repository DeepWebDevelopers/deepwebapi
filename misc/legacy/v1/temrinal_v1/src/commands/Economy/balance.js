const mongo = require("../../mongo");
const profileSchema = require("../../db/profile");
const Discord = require("discord.js");

module.exports = {
	name: "balance",
	aliases: ["bal"],
	minArgs: 0,
	maxArgs: 1,
	cooldown: "3s",
	expectedArgs: "[mention]",
	description: "Display the amount of coins you have",
	category: "Economy",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const target = message.mentions.users.first() || message.author;
		const userId = target.id;

		await mongo().then(async (mongoose) => {
			try {
				let data = await profileSchema.findOne({ userId: userId });

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
					.setTitle(`${target.tag}'s coin balance`)
					.setDescription(
						`\n**Wallet:** $${formatNumber(
							data.wallet
						)}\n**Bank:** $${formatNumber(data.bank)}`
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
