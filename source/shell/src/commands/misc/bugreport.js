const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "bugreport",
			aliases: ["breport"],
			group: "misc",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: [
				"SEND_MESSAGES",
				"VIEW_CHANNEL",
				"ADD_REACTIONS",
				"EMBED_LINKS",
			],
			memberName: "bug_report_command",
			description: "reports a bug in the bot from a user",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		let reporte = args.join(" ");

		if (!reporte)
			return message.channel.send("You did not send anything to report?");

		const msg = await message.channel.send(
			`Are you sure you want to send the bug report? This Action cannot be undone! Your report: ${reporte}`
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
					const embed = new Discord.MessageEmbed()
						.setTitle("Bug Report Submitted")
						.setDescription(" **Report**\n" + "< " + reporte + " >")
						.addField(
							" **Server Name**",
							`${message.guild.name}, ID:[${message.guild.id}]`
						)
						.addField(
							"** Report Author**",
							`${message.author.tag}, ID:[${message.author.id}]`
						)
						.setTimestamp();

					let bugChannel = message.client.channels.cache.get(
						"818581998142619678"
					);
					await bugChannel.send(embed); // our bug reports channel in the bot server
					message.channel.send(
						`The message has been sent successfully! **Run: ${prefix}support** to join our support server.`
					);
				} else if (reaction.first().emoji.name === "❌") {
					const embed = new Discord.MessageEmbed()
						.setDescription(
							`Command has been canceled by ${message.author.tag}`
						)
						.setColor("GREEN")
						.setTimestamp();
					message.channel.send(embed);
				}
			})
			.catch((err) => {
				const embed = new Discord.MessageEmbed()
					.setTitle(`Error Detected`)
					.setDescription(
						`:no_entry: You Have Ran Out Of Time To Respond. Please Try Again. :no_entry:`
					)
					.setColor(`RED`);
				console.log(err);
				return message.channel.send(embed);
			});
	}
};
