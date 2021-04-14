const process = require("child_process");
const Guild = require("../../../db/guild/logging");
const mongoose = require("mongoose");
module.exports = {
	name: "setlogs",
	aliases: "setlog",
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<channel>",
	description: "Sets the moderation channel for the bot.",
	category: "Bot Owner",
	ownerOnly: false,
	guildOnly: true,
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!message.member.hasPermission("MANAGE_GUILD"))
			return message.channel
				.send("You do not have permission to use this command.")
				.then((m) => m.delete({ timeout: 5000 }));
		const Loggingchannel = message.mentions.channels.first() || args[0];

		if (!Loggingchannel)
			return message.channel
				.send(
					"I cannot find that channel. Please mention a channel within this server or give its ID."
				)
				.then((m) => m.delete({ timeout: 5000 }));
		await Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, guild) => {
				if (err) console.error(err);
				if (!guild) {
					const newGuild = new Guild({
						_id: mongoose.Types.ObjectId(),
						guildID: message.guild.id,
						guildName: message.guild.name,
						logChannelID: Loggingchannel.id,
						logChannelName: Loggingchannel.name,
					});

					await newGuild
						.save()
						.then((result) => console.log(result))
						.catch((err) => console.error(err));

					return message.channel.send(
						`The mod logs channel has been set to ${Loggingchannel}`
					);
				} else {
					guild
						.updateOne({
							logChannelID: Loggingchannel.id,
							logChannelName: Loggingchannel.name,
						})
						.then((result) => console.log(result))
						.catch((err) => console.error(err));

					return message.channel.send(
						`The mod logs channel has been set to ${Loggingchannel}`
					);
				}
			}
		);
	},
};
