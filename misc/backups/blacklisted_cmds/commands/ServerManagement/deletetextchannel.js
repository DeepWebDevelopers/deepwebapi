const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "deletetextchannel",
      aliases: ["dtc"],
      group: "creation",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "deletetextchannel_creation_command",
      description: "delete a text channel",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
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

    if (!message.member.hasPermission("MANAGE_CHANNELS", (explicit = true))) {
      const permEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Delete text channel unsuccessful")
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ format: "png", dynamic: true })
        )
        .setDescription("You don't have the correct permissions.")
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(permEmbed);
      return;
    } else if (!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
      const permEmbed2 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Delete text channel unsuccessful")
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          "I don't have the correct permissions. Try re-inviting me and adding `Manage Channels` permission. If this problem occurs, do g?info support."
        )
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(permEmbed2);
      return;
    }

    let modlog = message.guild.channels.cache.find(
      (channel) => channel.name === "t-modlog"
    );

    if (!modlog)
      message.channel.send(
        "**WARNING:** The owner did not setup Terminal, this means that actions will not be logged, it is highly recommended that you setup Terminal."
      );

    if (!args[0]) {
      const nochnlEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Delete text channel unsuccessful")
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ format: "png", dynamic: true })
        )
        .setDescription(`Please mention a channel or provide it's ID.`)
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(nochnlEmbed);
      return;
    }

    let channel =
      message.mentions.channels.first() ||
      message.client.channels.cache.get(args[0]);
    let reason = args[1];

    if (!args[1]) {
      reason = "No reason given";
    }

    if (!channel) {
      const nochnlEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Delete text channel unsuccessful")
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ format: "png", dynamic: true })
        )
        .setDescription(`Please mention a channel or provide it's ID.`)
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(nochnlEmbed);
      return;
    }

    if (channel.type === "voice") {
      const WRONGCOMMANDBITCH = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Delete text channel unsuccessful")
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `This command is meant to delete **text** channels, if you wish to delete a voice channel, please use g?deletevoicechannel or dvc for short.`
        )
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(WRONGCOMMANDBITCH);
      return;
    }

    channel.delete();

    const success = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Delete text channel successful")
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ format: "png", dynamic: true })
      )
      .setDescription(`Successfully deleted ${channel.name}`)
      .setThumbnail(message.client.user.avatarURL())
      .setTimestamp()
      .setFooter("Thank you for using Terminal!");
    message.channel.send(success);
  }
};
