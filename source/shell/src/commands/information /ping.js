const commando = require("discord.js-commando");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "ping",
			group: "information",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "ping_command",
			description: "Sends the ping...",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 30,
			},
		});
	}
	async run(message) {
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
	}
};
