const Discord = require("discord.js");
const canvacord = require("canvacord").Canvas;
const axios = require("axios");

module.exports = {
	name: "dstatus",
	aliases: ["discordstatus"],
	minArgs: 0,
	maxArgs: 0,
	cooldown: "30s",
	description: "Gets the latest information about Discord status.",
	category: "Imformation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const url = "https://discordstatus.com/api/v2/incidents.json";
		const ping = Math.round(client.ws.ping);

		axios.get(url).then(async function (res) {
			const incident = res.data.incidents[0];
			let msg = "";

			msg += `**Incident: **${incident.name} \`(${incident.id})\`\n`;
			msg += `**Status: ** ${incident.status}\n`;
			msg += `**URL: ** [Link](${incident.shortlink})\n`;
			msg += `**Started: ** ${incident.created_at}\n`;
			msg += `**Latest Update: ** ${incident.updated_at}\n`;

			const inciUpdates = incident.incident_updates[0];
			if (inciUpdates !== null) {
				msg += "\n\n**Updates**\n";
				msg += `**Status Update: ** ${inciUpdates.status}\n`;
				msg += `**Information:** ${inciUpdates.body}\n`;
				msg += `**Date:** ${inciUpdates.created_at}\n`;
			}

			const embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Discord Status Updates")
				.setDescription(
					`**API Latency:** ${ping} ms\n\n**Latest incident**\n${msg}`
				)
				.setFooter("Thank you for using Terminal!")
				.setTimestamp();
			return message.channel.send(embed);
		});
	},
};
