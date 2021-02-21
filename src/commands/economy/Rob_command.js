const commando = require("discord.js-commando");
const Discord = require("discord.js");
const userConfig = require("../../db/economy");
const { MessageEmbed } = require("discord.js");
const currencyFunctions = require("../../util/eco/currencyFunctions");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "rob",
			group: "economy",
			memberName: "rob-command",
			description: "..",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10800, // 3 hour
			},
		});
	}
	async run(message, args) {
		const user = message.mentions.members.first();
		const targetuser = await currencyFunctions.findUser(
			message.member.id,
			message.guild.id
		);
		const author = currencyFunctions.findUser(
			message.author.id,
			message.guild.id
		);
		const coins = userConfig
			.find({ guildId: message.guild.id })
			.sort([["coins"]])
			.exec();

		if (!user) {
			return message.channel.send("Usage: `rob <user>`");
		}
		//    else if (message.member.id === message.author.id) {
		//        return message.channel.send('You can\'t rob yourself stupid!');
		//    }
		else if (author.coins < 500) {
			// if the authors balance is less than 250, return this.
			return message.channel.send(
				":x: You need atleast 500 coins to rob somebody."
			);
		} else if (targetuser.coins <= 0) {
			// if mentioned user has 0 or less, it will return this.
			return message.channel.send(`:x: ${user} does not have anything to rob.`);
		}

		if (targetuser) {
			const randomNumber = Math.floor(Math.random() * 200) + 15; // random number 200-1, you can change 200 to whatever you'd like

			await currencyFunctions.giveCoins(
				message.author.id,
				message.guild.id,
				randomNumber
			); //! adds the robbed ammount to the user

			const embed = new Discord.MessageEmbed()
				.setDescription(
					`${message.author.username} you robbed ${user} and got away with\`${randomNumber}\` cloins!`
				)
				.setColor("GREEN")
				.setTimestamp();
			message.channel.send(embed);

			//! Sends the robbed user a dm.
			// user.send(`You were robbed by **${message.author.tag}** in **${message.guild.name}** and lost \`${randomNumber} coins.\``).catch(e => {
			//     return console.log(e)

			// })
		}
	}
};
