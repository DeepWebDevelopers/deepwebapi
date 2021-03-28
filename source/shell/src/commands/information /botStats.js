const Discord = require("discord.js");
const { version } = require("discord.js");
const moment = require("moment");
const m = require("moment-duration-format");
const os = require("os");
const cpuStat = require("cpu-stat");
const ms = require("ms");
const permissions = "8"; // invite link perms
const myversion = "0.0.5";

const commando = require("discord.js-commando");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "stats",
			aliases: ["botstats", "botcpu"],
			group: "information",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			memberName: "botstatus_cpu_info_command",
			description: "Sends information on the bot host pc.",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 180,
			},
		});
	}
	async run(message, args, client) {
		cpuStat.usagePercent(function (err, percent, seconds) {
			if (err) {
				return console.log(err);
			}
			const duration = moment
				.duration(message.client.uptime)
				.format(" D [days], H [hrs], m [mins], s [secs]");

			// if (!message.client.shards)
			// 	return message
			// 		.reply("Sorry shards are offline at the moment. Try again later!")
			// 		.then((m) => {
			// 			m.delete({ timeout: 3908 });
			// 		});
			const promises = [
				message.client.shard.fetchClientValues("guilds.cache.size"),
				message.client.shard.broadcastEval(
					"this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)"
				),
			];

			Promise.all(promises)
				.then((results) => {
					const totalGuilds = results[0].reduce(
						(acc, guildCount) => acc + guildCount,
						0
					);
					const totalMembers = results[1].reduce(
						(acc, memberCount) => acc + memberCount,
						0
					);
					const botinfo = new Discord.MessageEmbed()
						.setAuthor(message.client.user.username)
						.setTitle("__**Stats:**__")
						.setColor("#2F3136")
						.addField(
							"⏳ Mem Usage",
							`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
								2
							)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
							true
						)
						.addField("⌚️ Uptime ", `${duration}`, true)
						.addField("📁 User's", `${totalMembers}`, true)
						.addField("📁 Server's", `${totalGuilds}`, true)
						.addField(
							"📁 Channels ",
							`${message.client.channels.cache.size}`,
							true
						)
						.addField("👾 Discord.js", `v${version}`, true)
						.addField("🤖 Node", `${process.version}`, true)
						.addField(
							"🤖 CPU",
							`\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``
						)
						.addField("🤖 CPU usage", `\`${percent.toFixed(2)}%\``, true)
						.addField("🤖 Pop!_Os", `\`${os.arch()}\``, true)
						.addField("💻 Platform", `\`\`${os.platform()}\`\``, true)
						.addField("API Latency", `${message.client.ws.ping}ms`)
						.addField("Bot Version", `${myversion}`, true)
						.addField(
							"🔗 Invite Link",
							`[https://discordapp.com/api/oauth2/authorize?...](https://discordapp.com/api/oauth2/authorize?client_id=${message.client.user.id}&permissions=${permissions}&scope=bot)`
						);
					message.channel.send(botinfo);
				})
				.catch((error) => {
					return console.log(error);
				});
		});
	}
};
