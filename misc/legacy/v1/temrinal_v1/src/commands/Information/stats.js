const Discord = require("discord.js");
let os = require("os");
let cpuStat = require("cpu-stat");
module.exports = {
	name: "stats",
	aliases: ["botstats"],
	minArgs: 0,
	maxArgs: 0,
	cooldown: "30s",
	description: "Host stats",
	category: "Information",
	run: async ({ message, args, text, client, prefix, instance }) => {
		cpuStat.usagePercent(function (err, precent, seconds) {
			if (err) {
				return console.error(err);
			}

			const cores = os.cpus().length;
			const cpuModel = os.cpus()[0].model;
			const guild = message.client.guilds.cache.size.toLocaleString();
			//? Supports sharding
			let user = client.guilds.cache.reduce(
				(acc, value) => acc + value.memberCount,
				0
			);
			// const user = message.client.users.cache.size.toLocaleString();
			const channel = message.client.channels.cache.size.toLocaleString();
			const usage = formatBytes(process.memoryUsage().heapUsed);
			const Node = process.version;
			const CPU = precent.toFixed(2);

			const embed = new Discord.MessageEmbed();
			embed.addField(
				"Terminal Statistics:",
				`Servers: ${guild}\nUsers: ${user}\nChannels: ${channel}\nMemory usage: ${usage}\nNode version: ${Node}\nCPU Usage: ${CPU}%`
			);
			embed.addField(
				"Physical Statistics:",
				`CPU: ${cpuModel}\nCPU core count: ${cores}\nUptime: ${parseDur(
					message.client.uptime
				)}`
			);
			embed.setColor("RANDOM");
			embed.setFooter("Thank you for using Terminal!");
			embed.setTimestamp();
			embed.setAuthor(message.author.tag, message.author.avatarURL());
			embed.setThumbnail(message.client.user.avatarURL());

			message.channel.send(embed);

			function formatBytes(a, b) {
				if (0 == a) return "0 Bytes";
				let c = 1024;
				let d = b || 2;
				let e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
				let f = Math.floor(Math.log(a) / Math.log(c));

				return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
			}

			function parseDur(ms) {
				let seconds = ms / 1000;
				let days = parseInt(seconds / 86400);
				seconds = parseInt(seconds % 86400);

				let hour = parseInt(seconds / 3600);
				seconds = parseInt(seconds % 3600);

				let minutes = parseInt(seconds / 60);
				seconds = parseInt(seconds % 60);

				if (days) {
					return `${days} day(s), ${hour} hour(s), ${minutes} minute(s)`;
				} else if (hour) {
					return `${hour} hour(s), ${minutes} minute(s), ${seconds} second(s)`;
				} else if (minutes) {
					return `${minutes} minute(s), ${seconds} second(s)`;
				}
				return `${seconds} second(s)`;
			}
		});
	},
};
