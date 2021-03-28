const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "forceleave",
			aliases: ["forcedestroy", "superkill"],
			group: "owner",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "force_kill_proccess_command",
			description: "forces the bot to leave a discord server.",
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;
	
		const msg = await message.channel.send(
			"Are You Sure You Want To Remove The Bot From This Server?"
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
			.then((reaction) => {
				if (reaction.first().emoji.name === "✅") {
					message.guild.leave();
					const embed = new Discord.MessageEmbed()
						.setTitle(`Successful`)
						.setDescription(
							`:white_check_mark:Successfully Left :white_check_mark:`
						)
						.setColor(`GREEN`)
						.setTimestamp();
					return message.channel.send(embed);
				} else if (reaction.first().emoji.name === "❌") {
					const embed = new Discord.MessageEmbed()
						.setTitle(`Cancelling...`)
						.setDescription(`:x: Leaving Guild Option Has Been Canceled :x:`)
						.setColor(`YELLOW`)
						.setTimestamp();
					return message.channel.send(embed);
				}
			})
			.catch(() => {
				const embed = new Discord.MessageEmbed()
					.setTitle(`Error Detected`)
					.setDescription(
						`:no_entry: You Have Ran Out Of Time To Respond. Please Try Again. :no_entry:`
					)
					.setColor(`RED`);
				return message.channel.send(embed);
			});
	}
};
