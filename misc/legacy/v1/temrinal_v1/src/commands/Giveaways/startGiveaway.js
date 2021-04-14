const ms = require("ms");
module.exports = {
	name: "startgiveaway",
	aliases: "ssg",
	minArgs: 0,
	maxArgs: 0,
	description: "Start a giveaway in your server.",
	category: "Giveaways",
	requiredPermissions: ["MENTION_EVERYONE"],
	run: async ({ message, args, text, client, prefix, instance }) => {
		const filter = (msg) => msg.author.id === message.author.id;
		const options = {
			max: 1,
		};

		message.channel.send(
			`**Starting giveaway process... Enter \`cancel\` anytime to end the process.**`
		);
		message.channel.send(
			"What is the duration of the giveaway? Please enter a valid value (1d, 1m, 1h), weeks and above are not supported, if youu wish to make the duration of the giveaway a week or longer, please do something like '7d' or '10d'."
		);

		let collector = await message.channel.awaitMessages(filter, options);
		let durationAnswer = collector.first().content;

		//Check if its cancel and cancel
		if (durationAnswer === "cancel" || durationAnswer === "Cancel") {
			message.channel.send(
				"**Giveaway process ended, requested by command executer.**"
			);
			return;
		}

		let duration = ms(durationAnswer);

		await message.channel.send("How many winners will this giveaway have?");

		let collector2 = await message.channel.awaitMessages(filter, options);
		let winnersAnswer = collector2.first().content;

		//Check if its cancel and cancel
		if (durationAnswer === "cancel" || durationAnswer === "Cancel") {
			message.channel.send(
				"**Giveaway process ended, requested by command executer.**"
			);
			return;
		}

		let winner = parseInt(winnersAnswer);

		if (isNaN(winner))
			return message.channel.send(
				"Invalid number of winners, please restart this process."
			);

		await message.channel.send(
			"Please mention the channel to post the giveaway in."
		);

		let collector3 = await message.channel.awaitMessages(filter, options);
		let channelMention = collector3.first().mentions.channels.first();
		//Check if its cancel and cancel
		if (
			collector3.first().content === "cancel" ||
			collector3.first().content === "Cancel"
		) {
			message.channel.send(
				"**Giveaway process ended, requested by command executer.**"
			);
			return;
		}

		if (
			channelMention &&
			channelMention.toString().includes("<#") &&
			channelMention &&
			channelMention.toString().includes(">")
		) {
			channelMention = channelMention.toString();
			channelMention = channelMention.substr(2);
			channelMention = channelMention.substr(0, channelMention.length - 1);
		} else
			return message.channel.send(
				"You did not mention a channel, please restart this process."
			);

		let channel = await client.channels.fetch(channelMention);

		if (!channel)
			return message.channel.send(
				"Could not find provided channel. Please restart this process."
			);

		await message.channel.send("What is the prize of the giveaway?");

		let collector4 = await message.channel.awaitMessages(filter, options);
		let prizeAnswer = collector4.first().content;

		//Check if its cancel and cancel
		if (prizeAnswer === "cancel" || prizeAnswer == "Cancel") {
			message.channel.send(
				"**Giveaway process ended, requested by command executer.**"
			);
			return;
		}

		await client.giveaways.startGiveaway({
			prize: prizeAnswer,
			channelId: channel.id,
			guildId: message.guild.id,
			duration: duration,
			winners: winner,
			hostedBy: message.author.id,
		});
	},
};
