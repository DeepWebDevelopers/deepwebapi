const Discord = require("discord.js");
module.exports = {
	name: "clear",
	aliases: ["purge", "bulkd"],
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: "<amount (2-100)>",
	description: "Delete messages in bulk",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const msgdel = parseInt(args[0]);
		if (!message.member.hasPermission("MANAGE_MESSAGES", (explicit = true))) {
			const clearpermEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Clear unsuccessful")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription("You don't have the correct permissions.")
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(clearpermEmbed);
		} else if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
			const clearpermEmbed2 = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Clear unsuccessful")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"I don't have the correct permissions. Try re-inviting me and adding `Manage Messages` permission. If this problem occurs, do g?info support."
				)
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(clearpermEmbed2);
		} else if (!args[0]) {
			const arg2Embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Clear unsuccessful")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"Please define how many messages to delete, between `2` and `100` (including the command)."
				)
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(arg2Embed);
		} else if (msgdel < 2 || msgdel > 100) {
			const arg2Embed2 = new Discord.MessageEmbed()
				.setTitle("Clear unsuccessful")
				.setColor("RANDOM")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"You cannot clear more than `100` messages and less than `2` messages (including the command)."
				)
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(arg2Embed2);
		} else {
			message.channel
				.bulkDelete(msgdel, {
					filterOld: true,
				})
				.then((delsize) => {
					message.channel
						.send(
							`Deleted ${delsize.size} messages. \`This message will self destruct in 3 seconds\``
						)
						.then((msg) => {
							msg.delete({
								timeout: 3000,
							});
						});
					if (msgdel !== delsize.size) {
						message.channel
							.send(
								"**Due to limitations, if I did not delete as many messages as you specified it's because I am unable to delete messages older than 14 days.**\n`This message will self destruct in 5 seconds`"
							)
							.then((message1) => {
								message1.delete({
									timeout: 5000,
								});
							});
					}
				});
		}
	},
};
