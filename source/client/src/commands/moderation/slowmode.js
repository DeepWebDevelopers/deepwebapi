module.exports = {
	name: "slowmode",
	minArgs: 1,
	maxArgs: -1,
	cooldown: "5s",
	expectedArgs: "<duration>",
	permissions: ["MANAGE_CHANNELS"],
	description: "Updates the channel slowmode.",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
			return message.channel.send(
				"**I Dont Have The Permissions To edit channels! - [MANAGE_CHANNELS]**"
			);
		const { channel } = message;

		if (args.length < 1) {
			message.reply("Please provide a duration.");
			return;
		}

		let duration = args.shift().toLowerCase();
		if (duration === "off") {
			duration = 0;
		}

		if (isNaN(duration)) {
			message.reply(
				'Please provide either a number of seconds or the word "off"'
			);
			return;
		}

		if (duration >= 21600) {
			return message.reply(
				"You have to set a duration lower than `21600`(6 hours.)"
			);
		}
		channel.setRateLimitPerUser(duration, args.join(" "));
		message.reply(
			`The slowmode for this channel has been set to **${duration}**`
		);
	},
};
