const commando = require("discord.js-commando");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "force-leave",
			group: "owner",
			memberName: "force-leave-cmd",
			description: "force-leave - makes the bot leave its server",
			ownerOnly: true,
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 4,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		const Discord = require("discord.js");

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
