const mongo = require("../../mongo");
const banSchema = require("../../db/ban");
const Discord = require("discord.js");

module.exports = {
	name: "unban",
	requiredPermissions: ["BAN_MEMBERS"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<user ID> [reason]",
	description: "Unban a user from the Discord server",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let modlog = message.guild.channels.cache.find((channel) => {
			return channel.name && channel.name.includes("t-modlog");
		});

		const target = await message.client.users.fetch(args[0]);

		if (!target) return message.channel.send("You need to provide a user ID.");

		const targetId = target.id;
		const targetTag = `${target.username}#${target.discriminator}`;

		if (targetId === client.user.id)
			return message.reply(
				"You cannot unban me because clearly I'm not banned."
			);
		if (targetId === message.author.id)
			return message.reply("You cannot unban yourself, what are you on.");

		const staff = message.member;
		const staffId = staff.id;
		const staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");

		if (!modlog)
			message.channel.send(
				`Could not find channel **t-modlog**, please install the required values using \`${prefix}setup\` as it is HIGHLY recommended.`
			);
		if (!reason) reason = "No reason provided.";

		await mongo().then(async (mongoose) => {
			try {
				let data = await banSchema.findOneAndDelete({
					banId: targetId,
					guildId: message.guild.id,
				});

				message.guild.members.unban(target);

				const success = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setDescription(
						`Successfully unbanned **${targetTag}** for **${reason}**`
					)
					.setFooter("Thank you for using Terminal!")
					.setTimestamp();
				message.channel.send(success);
			} catch (err) {
				console.log(err);
				message.channel.send(`An error occurred: \`${err.message}\``);
			}
		});
	},
};
