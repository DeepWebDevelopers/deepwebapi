module.exports = {
	name: "slowmode",
	aliases: ["lockdown"],
	minArgs: 0,
	maxArgs: 0,
	cooldown: "5s",
	permissions: ["MANAGE_CHANNELS"],
	description: "Updates the channel slowmode.",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
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
		channel.setRateLimitPerUser(duration, args.join(" "));
		message.reply(`The slowmode for this channel has been set to ${duration}`);
	},
};
