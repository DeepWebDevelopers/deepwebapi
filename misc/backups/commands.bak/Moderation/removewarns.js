const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const warnSchema = require("../../db/warn");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "removewarns",
      aliases: ["rwarns", "rwarn", "clearwarns"],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES", "KICK_MEMBERS"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "remove_warns_command",
      description: "Remove warns from a member.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    let target = message.mentions.users.first();
    if (!target)
      return message.reply(
        "Please specify someone to remove their warnings for."
      );

    if (target === message.author) {
      return message.reply(
        "You can clear your own warnings. To run them run `warns`."
      );
    }

    if (
      target.hasPermission("ADMINISTRATOR") &&
      !message.author.hasPermission("ADMINISTRATOR")
    ) {
      return message.channel.send("you cant clear an Administrator's warns.'");
    }
    const guildId = message.guild.id;
    const userId = target.id;

    try {
      await warnSchema.findOneAndDelete({
        warnId: userId,
        guildId: guildId,
      });
    } catch (e) {
      console.log(e);
      message.channel.send(`An error occurred: ${e.message}`);
    }

    message.channel.send(
      `Removed all warnings for ${target} \n\nAction logged in <#${modlog.id}>`
    );

    //? logging
    const Logs = require("../../db/guild/logging");
    var d = new Date(Date.now());
    const guildDB = await Logs.findOne(
      {
        guildID: message.guild.id,
      },
      async (err, guild) => {
        if (err) console.error(err);

        if (!guild) {
          let mongoose = require("mongoose");
          const newLogData = new Logs({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            logChannelID: null,
            logChannelName: null,
          });

          await newLogData
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.error(err));
          return message.reply(
            `There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
          );
        }
      }
    );
    const modlog = message.guild.channels.cache.get(guildDB.logChannelID);
    if (!modlog) {
      return message
        .reply(
          `Sorry I cant find your mod log channen in my db. Please create one using **${prefix}setlogs** then run this command again!`
        )
        .then((m) => {
          m.delete({ timeout: 5000 });
        });
    }

    const logEmbed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("Warnings cleared for user")
      .setAuthor("Automated Terminal message", message.client.user.avatarURL())
      .addFields(
        {
          name: "Moderator: ",
          value: `${message.author} (${message.author.id})`,
        },
        {
          name: "Moderated on: ",
          value: `${target} (${target.id})`,
        },
        {
          name: "Date: ",
          value: `${message.createdAt.toLocaleString()}`,
        }
      )
      .setThumbnail(message.client.user.avatarURL())
      .setTimestamp()
      .setFooter("Thank you for using Terminal!");
    modlog.send(logEmbed).catch((e) => {
      return;
    });
  }
};
