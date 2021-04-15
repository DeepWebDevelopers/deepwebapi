const Discord = require("discord.js");
const commando = require("discord.js-commando");
const Guild = require("../../db/guild/logging");
const mongoose = require("mongoose");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "setlogs",
      aliases: ["setlogchannel", "setmodlogs"],
      group: "config",
      userPermissions: ["SEND_MESSAGES", "MANAGE_GUILD"],
      clientPermissions: ["SEND_MESSAGES"],
      memberName: "modlog_channel_set_command",
      description: "Sets the modlog channel for your server.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 15,
      },
      examples: ["setlogs #moglods"],
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

    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel
        .send("You do not have permission to use this command.")
        .then((m) => m.delete({ timeout: 5000 }));
    const Loggingchannel = message.mentions.channels.first() || args[0];

    if (!Loggingchannel)
      return message.channel
        .send(
          "I cannot find that channel. Please mention a channel within this server or give its ID."
        )
        .then((m) => m.delete({ timeout: 8000 }));
    await Guild.findOne(
      {
        guildID: message.guild.id,
      },
      async (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new Guild({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            logChannelID: Loggingchannel.id,
            logChannelName: Loggingchannel.name,
          });

          await newGuild
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.error(err));

          return message.channel.send(
            `The mod logs channel has been set to ${Loggingchannel}. To reset this data run: ${prefix}reset`
          );
        } else {
          guild
            .updateOne({
              logChannelID: Loggingchannel.id,
              logChannelName: Loggingchannel.name,
            })
            .then((result) => console.log(result))
            .catch((err) => console.error(err));

          return message.channel.send(
            `The mod logs channel has been set to ${Loggingchannel}. To reset this data run: ${prefix}reset`
          );
        }
      }
    );
  }
};
