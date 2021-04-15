const canvacord = require("canvacord").Canvas;
const axios = require("axios");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class DiscordStatusCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "discordstatus",
      aliases: ["dstatus"],
      group: "webhooks",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "discord_status_command",
      description: "shows the discord api stats",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 120,
      },
    });
  }
  async run(message, args, client) {
    // ! Checks if the user is blacklisted or not!
    if (await isBlacklisted(message)) return;

    async function isBlacklisted(message) {
      const blacklist = require("../../db/blacklist");
      var isBanned = false;
      await blacklist.findOne(
        {
          userID: message.author.id,
        },
        (err, data) => {
          if (err) throw err;
          if (data) {
            isBanned = true;
            return message.reply(
              "You are blacklisted from using the bot! \n For more information on why, join our support server."
            );
          }
        }
      );
      if (isBanned) return true;
      return false;
    }
    const prefix = message.guild.commandPrefix;

    const url = "https://discordstatus.com/api/v2/incidents.json";
    const ping = Math.round(this.client.ws.ping);

    axios.get(url).then(async function (res) {
      const incident = res.data.incidents[0];
      let msg = "";

      msg += `**Incident: **${incident.name} \`(${incident.id})\`\n`;
      msg += `**Status: ** ${incident.status}\n`;
      msg += `**Source_URL: ** [Link](${incident.shortlink})\n`;
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
        .setColor("BLURPLE")
        .setTitle("Discord Status Updates")
        .setDescription(
          `**API Latency:** ${ping} ms\n\n**Latest incident**\n${msg}`
        )
        .setFooter("Thank you for using Terminal!")
        .setTimestamp();
      return message.channel.send(embed);
    });
  }
};
