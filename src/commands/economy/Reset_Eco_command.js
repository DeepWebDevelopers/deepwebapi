const commando = require("discord.js-commando");
const Discord = require("discord.js");
const userConfig = require("../../db/economy");
const { MessageEmbed } = require("discord.js");
const currencyFunctions = require("../../util/eco/currencyFunctions");

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "reset-data",
			aliases: ["leave-eco"],
			group: "economy",
			memberName: "..reset-my-eco",
			description: "..",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 3600, //! 1 hour
			},
		});
	}
	async run(message, args) {
		const Discord = require("discord.js");
		const member = message.member;
		const user = await currencyFunctions.findUser(member.id, message.guild.id);

		const msg = await message.channel.send(
			"Are You Sure You Want To Delete your economy data, this cannot be undone?"
		);
		await msg.react("✅");
		await msg.react("❌");
		const filter = (reaction, user) => {
			return (
				(reaction.emoji.name === "✅" || reaction.emoji.name === "❌") &&
				user.id === message.author.id
			);
		};

		msg
			.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
			.then(async (reaction) => {
				if (reaction.first().emoji.name === "✅") {
					currencyFunctions.deleteUser(member.id, member.guild.id);
					const embed = new MessageEmbed()
						.setTitle(`Successful`)
						.setDescription(
							`${message.author.tag} all you data has been deleted from the economy. You are poor again.`
						)
						.setColor("#c28ada")
						.setTimestamp();
					return message.channel.send(embed);
				} else if (reaction.first().emoji.name === "❌") {
					const embed2 = new MessageEmbed()
						.setTitle(`Cancelling...`)
						.setDescription(`${message.author.tag} has canceled data deletion.`)
						.setColor("#e7e7e7")
						.setTimestamp();
					return message.channel.send(embed2);
				}
			})
			.catch(() => {
				const embed3 = new Discord.MessageEmbed()
					.setTitle(`Error Detected`)
					.setDescription(
						`:no_entry: You Have Ran Out Of Time To Respond. Please Try Again. :no_entry:`
					)
					.setColor(`RED`);
				return message.channel.send(embed3);
			});
	}
};
