const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "hackban",
	aliases: ["lockdown"],
	minArgs: 0,
	maxArgs: 0,
	cooldown: "15s",
	permissions: ["MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS"],
	description: "Updates the channel slowmode.",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let userID = args[0];

		let reason = args.slice(1).join(" ");

		if (!userID) return message.channel.send("Please insert a valid user ID.");

		if (isNaN(userID)) return message.channel.send("User ID must be a number.");

		if (userID === message.author.id)
			return message.channel.send(
				"I should really ban you for trying to ban yourself you dummy!"
			);

		if (userID === message.client.user.id)
			return message.channel.send("You can't ban me stupid!");

		if (!reason) reason = "No reason provided";

		message.client.users
			.fetch(userID)
			.then(async (user) => {
				await message.guild.members.ban(user.id, { reason: reason });

				const embed = new MessageEmbed()
					.setColor("RANDOM")
					.setTitle("Hack Ban!")
					.setDescription(
						`**${user.tag}** has been banned, from outside this server.`
					)
					.addField("Reason for ban:", reason)
					.setFooter(`User was banned by ${message.author.tag}`);
				return message.channel.send(embed);
			})
			.catch((error) => {
				// If the user is unavailable, return some errors. (Recommended)

				return message.channel.send(`An error occurred: **${error}**`);
			});
	},
};
