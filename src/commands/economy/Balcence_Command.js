const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const userConfig = require("../../db/economy");
const currencyFunctions = require("../../util/eco/currencyFunctions");
const commando = require("discord.js-commando");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "bal",
			aliases: ["balence", "money"],
			group: "economy",
			memberName: "balence coomand",
			description: "Shows your balence",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 20,
			},
		});
	}
	async run(message, args) {
		const member =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args.join(" ")) ||
			message.guild.members.cache.find(
				(member) =>
					member.user.username.toLowerCase() === args.join(" ") ||
					member.user.username === args.join(" ")
			) ||
			message.member;

		let data = await currencyFunctions.findUser(member.id, member.guild.id);

		if (!data) {
			await message.reply(
				"Updating database...try running this command again in 5 seconds."
			);

			const newData = new userConfig({
				userId: member.id,
				guildId: member.guild.id,
			});
			newData.save();
			return;
		}

		const embed = new Discord.MessageEmbed()
			.setTitle(`${member.user.username}'s Balance`)
			.setThumbnail(message.guild.iconURL())
			.setTimestamp()
			.setDescription(
				`**Wallet**: ${data.coins.toLocaleString()}\n **Bank**: ${data.coinsInBank.toLocaleString()}/${data.bankSpace.toLocaleString()}\n**Total**: ${(
					data.coins + data.coinsInBank
				).toLocaleString()}`
			)
			.setColor("#e7e7e7");
		message.channel.send(embed);
	}
};
