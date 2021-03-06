const mongo = require("../../mongo");
const profileSchema = require("../../db/profile");
const Discord = require("discord.js");

module.exports = {
	name: "inventory",
	aliases: ["inv"],
	minArgs: 0,
	maxArgs: 0,
	description: "View your inventory",
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

				let str = "";
				let array = [];
				let embed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle(`${target.tag}'s inventory`)
					.setThumbnail(
						target.displayAvatarURL({
							format: "png",
							dynamic: true,
						})
					)
					.setTimestamp()
					.setFooter("Inventories are sorted in alphabetical order");

				if (data.inventory.length > 0) {
					for (let i = 0; i < data.inventory.length; i++) {
						array.push(data.inventory[i].name);
					}

					array.sort((a, b) => {
						if (a < b) {
							return -1;
						}
						if (a > b) {
							return 1;
						}
						return 0;
					});

					str = count(array);
				} else str = count(array);

				embed.setDescription(str);

				return message.channel.send(embed);
			} catch (err) {
				console.log(err);
				message.channel.send(
					`An error occurred: \`${err.message}\`\nUsually this happens once, please try again.`
				);
			}
		});

		function count(arr) {
			let str = "";

			if (arr.length < 1)
				return "Nothing...\n\n\nSo, maybe buy something?\n\n^_^";

			var current = null;
			var cnt = 0;

			for (let i = 0; i < arr.length; i++) {
				if (arr[i] !== current) {
					if (cnt > 0) str += `${current} x${cnt}\n`;

					current = arr[i];
					cnt = 1;
				} else cnt++;
			}

			if (cnt > 0) str += `${current} x${cnt}\n`;

			return str;
		}
	},
};
