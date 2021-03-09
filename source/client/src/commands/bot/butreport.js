const Discord = require("discord.js");

module.exports = {
	name: "report",
	aliases: ["bugreport", "reportbug", "bug"],
	minArgs: 1,
	maxArgs: 100,
	cooldown: "30m",
	expectedArgs: "<The report>",
	permissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"EMBED_LINKS",
		"ADD_REACTIONS",
	],
	description: "Report a bug to the developers",
	category: "Bot Owner",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!message.guild.me.permissions.has("EMBED_LINKS", "ADD_REACTIONS"))
			return message.channel.send(" I don't have permissions to send embeds.");

		const msg = await message.channel.send(
			"Are you sure you want to send the bug report? This Action cannot be undone! `Users who abuse this will be blacklisted from the bot.`"
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
					let reporte = args.join(" ");

					if (!reporte)
						return message.channel.send("Send your question or question.");
					message.channel.send("The message has been sent successfully!");
					const embed = new Discord.MessageEmbed()
						.setTitle("Bug Report Submitted")
						.setDescription(" **Report**\n" + "< < < " + reporte + " > > >")
						.addField(
							" **Server Name**",
							`${message.guild.name}, ID:[${message.guild.id}]`
						)
						.addField(
							"** Report Author**",
							`${message.author.tag}, ID:[${message.author.id}]`
						)
						.setTimestamp();

					let bugChannel = client.channels.cache.get("818581998142619678");
					await bugChannel.send(embed); // our bug reports channel in the bot server
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
			.catch(() => {
				const embed = new Discord.MessageEmbed()
					.setTitle(`Error Detected`)
					.setDescription(
						`:no_entry: You Have Ran Out Of Time To Respond. Please Try Again. :no_entry:`
					)
					.setColor(`RED`);
				return message.channel.send(embed);
			});
	},
};
