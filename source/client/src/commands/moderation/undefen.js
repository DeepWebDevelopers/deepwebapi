const Discord = require("discord.js");
const mongo = require("../../mongo");
const deafSchema = require("../../db/deafen");

module.exports = {
	name: "undeafen",
	aliases: ["undeaf"],
	requiredPermissions: ["DEAFEN_MEMBERS"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<mention> [reason]",
	description: "Allow a user to hear others in a voice channel",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let modlog = message.guild.channels.cache.find((channel) => {
			return channel.name && channel.name.includes("t-modlog");
		});

		let target = message.mentions.members.first();
		let targetId = target.id;
		let targetTag = `${target.user.username}#${target.user.discriminator}`;

		if (targetId === client.user.id)
			return message.reply("You cannot undeafen me");
		if (targetId === message.author.id)
			return message.reply("You cannot undeafen yourself.");
		if (target.user.bot)
			return message.reply("Target is a bot, failed to undeafen.");

		let staff = message.member;
		let staffId = staff.id;
		let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");
		if (!modlog)
			message.channel.send(
				`Could not find channel **t-modlog**, please install the required values using \`${prefix}setup\` as it is HIGHLY recommended.`
			);

		if (!target.voice.channel)
			return message.reply(`${targetTag} is not connected to a voice channel.`);
		if (!target.voice.serverDeaf)
			return message.reply(`${targetTag} is already not server deafened.`);

		await mongo().then(async (mongoose) => {
			try {
				let data = await deafSchema.findOneAndDelete({
					deafId: targetId,
					guildId: message.guild.id,
				});

				target.voice.setDeaf(false, reason);

				const success = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setDescription(
						`Successfully undeafened **${targetTag}** for **${reason}**`
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
