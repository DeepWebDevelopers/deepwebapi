const commando = require("discord.js-commando");
const Discord = require("discord.js");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const types = {
	dm: "DM",
	group: "Group DM",
	text: "Text Channel",
	voice: "Voice Channel",
	category: "Category",
	unknown: "Unknown",
};
module.exports = class ChannelCommand extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "channel",
			aliases: ["channel-info"],
			group: "info",
			memberName: "channel",
			description: "Responds with detailed information on a channel.",
			clientPermissions: ["EMBED_LINKS"],
			args: [
				{
					key: "channel",
					prompt: "Which channel would you like to get information on?",
					type: "channel",
					default: (msg) => msg.channel,
				},
			],
			throttling: {
				usages: 3,
				duration: 60,
			},
		});
	}

	run(msg, { channel }) {
		const embed = new MessageEmbed()
			.setColor("#c28ada")
			.addField(
				"❯ Name",
				channel.type === "dm" ? `@${channel.recipient.username}` : channel.name,
				true
			)
			.addField("❯ ID", channel.id, true)
			.addField("❯ NSFW", channel.nsfw ? "Yes" : "No", true)
			.addField(
				"❯ Category",
				channel.parent ? channel.parent.name : "None",
				true
			)
			.addField("❯ Type", types[channel.type], true)
			.addField(
				"❯ Creation Date",
				moment.utc(channel.createdAt).format("MM/DD/YYYY h:mm A"),
				true
			)
			.addField("❯ Topic", channel.topic || "None");
		return msg.embed(embed);
	}
};