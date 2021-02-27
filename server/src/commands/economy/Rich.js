const commando = require("discord.js-commando");
const userConfig = require("../../db/economy");
const { MessageEmbed } = require("discord.js");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "rich",
			aliases: ["howrich", "leaderboard", "leader-board", "lb", "top"],
			group: "economy",
			memberName: "rich-command-210398",
			description: "..",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 30,
			},
		});
	}
	async run(message, args) {
		let users = await userConfig
			.find({ guildId: message.guild.id })
			.sort([["coins", "descending"]])
			.exec();

		const rich = users.slice(0, 10);

		if (rich.length < 1) return;

		const array = [];

		rich.map((key) =>
			array.push({
				userId: key.userId,
				coins: key.coins,
				coinsInBank: key.coinsInBank,
				username: message.client.users.cache.get(key.userId)
					? message.client.users.cache.get(key.userId)
					: "Nobody",
				// discriminator: message.client.users.cache.get(key.userId) ? message.client.users.cache.get(key.userId) : "#0000"
			})
		);

		const mappedArray = array.map(
			(e) => `Total Coins: **${e.coins + e.coinsInBank}** - ${e.username}`
		);

		const embed = new MessageEmbed()
			.setAuthor(`Richest Users in ${message.guild.name}`)
			.setDescription(`${mappedArray.join("\n")}`)
			.setTimestamp()
			.setThumbnail(message.guild.iconURL())
			.setFooter(`Command ran by ${message.author.username}`)
			.setColor("#e7e7e7");
		message.channel.send(embed);
	}
};
