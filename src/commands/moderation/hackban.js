const { MessageEmbed } = require("discord.js");
const commando = require("discord.js-commando");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "hackban",
			aliases: ["hban", "h-ban", "hack-ban"],
			group: "moderation",
			memberName: "hack-ban-cmd",
			description: "Bans a member who is not in your server!",
			userPermissions: ["BAN_MEMBERS"],
			clientPermissions: ["BAN_MEMBERS"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 45,
			},
		});
	}
	async run(message, args) {
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
					.setColor("BLUE")
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
	}
};
