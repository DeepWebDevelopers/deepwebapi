const Commando = require("discord.js-commando");

module.exports = class SlowCommand extends (
	Commando.Command
) {
	constructor(client) {
		super(client, {
			name: "slowdown",
			aliases: ["slowmode", "lockdown", "slow"],
			group: "moderation",
			memberName: "slow",
			userPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
			clientPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
			description: "Changes the slowmode duration for this channel",
			argsType: "multiple",
			throttling: {
				usages: 5,
				duration: 60,
			},
		});
	}

	run = (message, args) => {
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
	};
};
