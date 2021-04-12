const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "deletevoicechannel",
      aliases: ["dvc"],
      group: "creation",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "deletevoicechannel_creation_command",
      description: "deletevoicechannel",
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
    const prefix = message.guild.commandPrefix;

    if (!message.member.hasPermission("MANAGE_CHANNELS", (explicit = true))) {
      const permEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Delete voice channel unsuccessful")
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
        .setTitle("Delete voice channel unsuccessful")
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
        .setTitle("Delete voice channel unsuccessful")
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ format: "png", dynamic: true })
        )
        .setDescription(`Please provide a voice channel's ID.`)
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(nochnlEmbed);
      return;
    }

    let channel = message.client.channels.cache.get(args[0]);
    let reason = args[1];

    if (!args[1]) {
      reason = "No reason given";
    }

    if (!channel) {
      const nochnlEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Delete voice channel unsuccessful")
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ format: "png", dynamic: true })
        )
        .setDescription(`Please provide a voice channel's ID.`)
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(nochnlEmbed);
      return;
    }

    if (channel.type === "text") {
      const WRONGCOMMANDBITCH = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Delete voice channel unsuccessful")
        .setAuthor(
          message.author.tag,
          message.author.avatarURL({ format: "png", dynamic: true })
        )
        .setDescription(
          `This command is meant to delete **voice** channels, if you wish to delete a text channel, please use g?deletetextchannel or dtc for short.`
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
      .setTitle("Delete voice channel successful")
      .setAuthor(
        message.author.tag,
        message.author.avatarURL({ format: "png", dynamic: true })
      )
      .setDescription(`Successfully deleted ${channel.name}`)
      .setThumbnail(message.client.user.avatarURL())
      .setTimestamp()
      .setFooter("Thank you for using Terminal!");
    message.channel.send(success);

    const logEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Voice channel deleted")
      .setAuthor("Modlog")
      .addFields(
        {
          name: "Moderator: ",
          value: `${message.author.tag} (${message.author.id})`,
        },
        {
          name: "Channel name: ",
          value: `${channel.name}`,
        },
        {
          name: "Reason: ",
          value: `${reason}`,
        },
        {
          name: "Date: ",
          value: `${message.createdAt.toLocaleString()}`,
        }
      )
      .setThumbnail(message.client.user.avatarURL())
      .setTimestamp()
      .setFooter("Thank you for using Terminal!");
    modlog.send(logEmbed);
  }
};
