const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const mongoose = require("mongoose");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "setxp-channel",
      aliases: ["xp-channel"],
      group: "config",
      userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_GUILD"],
      memberName: "xp_channel_config",
      description: "Sets the XP channel for your server",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: false,
      throttling: {
        usages: 3,
        duration: 25,
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

    const XPschema = require("../../db/guild/xp-logs");
    const channel = message.mentions.channels.first() || args[0];

    if (!channel) return message.reply("You need to mention a channel to set!");

    try {
      XPschema.findOne(
        {
          guildID: message.guild.id,
        },
        async (err, data) => {
          if (err) console.error(err);
          if (!data) {
            const newXPdata = new XPschema({
              _id: mongoose.Types.ObjectId(),
              guildID: message.guild.id,
              guildName: message.guild.name,
              xpChannel: channel,
            });

            await newXPdata
              .save()
              .then((result) => console.log(result))
              .catch((err) => console.error(err));
            message.reply(`The XP logs channel has been set to ${channel}!`);
          } else {
            XPschema.updateOne({
              guildName: message.guild.name,
              guildID: message.guild.id,
              xpChannel: channel,
            })
              .then((result) => console.log(result))
              .catch((err) => console.error(err));

            message.reply(
              `The XP logs channel has been set to ${channel}! To reset run my \`${prefix}reset\` command.`
            );
          }
        }
      );
    } catch (err) {
      console.log(err);
      return message.reply("I ran into an error, please retry command.");
    }
  }
};
