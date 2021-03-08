module.exports = {
	commands: "pings",
	aliases: ["ping"],
	minArgs: 0,
	maxArgs: 0,
	cooldown: "20s",
	permissions: ["SEND_MESSAGES"],
	description: "Fetch latency",
	category: "Information",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const m = await message.channel.send("Fetching ping...");
		// .then((m) => m.delete({ timeout: 3000 }));
		const msglate = m.createdTimestamp - message.createdTimestamp;
		const msguser = message.client.users.cache.get(message.author.id);
		message.channel.send(
			`Pong! 🏓 Message latency is ${msglate} ms, Discord API latency is ${Math.round(
				message.client.ws.ping
			)} ms!`
		);

		if (msglate >= 5000) {
			await msguser.send(
				`**${message.author.tag}**, sorry your message latency is **${msglate}**. If you would like to, contact Discord support to find out why. https://support.discord.com/hc/en-us`
			);
			console.log(
				`${message.author.tag} aquired ${msglate} message latency in ${message.guild.name} (${message.guild.id}).`
			);
		}
		if (message.client.ws.ping >= 5000) {
			await msguser.send(
				`**${message.author.tag}**, sorry your message latency is **${message.client.ws.ping}**. If you would like to, contact Discord support to find out why. https://support.discord.com/hc/en-us`
			);
			console.log(
				`${message.author.tag} aquired ${message.client.ws.ping} Discord API latency in ${message.guild.name} (${message.guild.id}).`
			);
		}
	},
};
