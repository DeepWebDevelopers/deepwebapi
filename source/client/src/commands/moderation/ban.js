const mongo = require("../../mongo");
const banSchema = require("../../db/ban");
const Discord = require("discord.js");

module.exports = {
	name: "ban",
	requiredPermissions: ["BAN_MEMBERS"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<mention> [reason]",
	description: "Ban a user from the Discord server",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let modlog = message.guild.channels.cache.find((channel) => {
			return channel.name && channel.name.includes("t-modlog");
		});

		const target = message.mentions.members.first();

		if (!target)
			return message.channel.send("You need to mention a valid user.");

		const targetId = target.id;
		const targetTag = `${target.user.username}#${target.user.discriminator}`;

		if (targetId === client.user.id)
			return message.reply("You cannot ban me using me.");
		if (targetId === message.author.id)
			return message.reply("You cannot ban yourself.");
		if (target.user.bot)
			return message.reply("Target is a bot, failed to ban.");

		const staff = message.member;
		const staffId = staff.id;
		const staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");

		if (!modlog)
			message.channel.send(
				`Could not find channel **t-modlog**, please install the required values using \`${prefix}setup\` as it is HIGHLY recommended.`
			);
		if (!reason) reason = "No reason provided.";
		if (staff.roles.highest.position < target.roles.highest.position)
			return message.reply(
				`You cannot ban ${targetTag} due to role hierarchy.`
			);

		await mongo().then(async (mongoose) => {
			try {
				let data = await banSchema.create({
					banId: targetId,
					banTag: targetTag,
					staffId: staffId,
					staffTag,
					staffTag,
					reason: reason,
					guildId: message.guild.id,
					guildName: message.guild.name,
					banDate: Date.now(),
				});

				message.guild.members.ban(target, {
					reason: reason,
				});

				const success = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setDescription(
						`Successfully banned **${targetTag}** for **${data.reason}**`
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
