const Discord = require("discord.js");
const commando = require("discord.js-commando");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "guild",
      aliases: ["guildinfo", "serverinfo", "server", "server	"],
      group: "information",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES"],
      memberName: "guild_information_command",
      description: "Sends information about your server.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 75,
      },
    });
  }
  async run(message, args) {
    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${message.guild.name} stats!`)
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setThumbnail(message.client.user.avatarURL())
      .setTimestamp()
      .setFooter("Thank you for using Terminal!");

    const memberCount = message.guild.memberCount;
    const maxMembers = message.guild.maximumMembers;
    const id = message.guild.id;
    const shardID = message.guild.shardID;
    const name = message.guild.name;
    const iconHash = message.guild.icon;
    const region = message.guild.region;
    const afkTimeout = message.guild.afkTimeout;
    const boostLevel = message.guild.premiumTier;
    const boosts = message.guild.premiumSubscriptionCount;
    const verification = message.guild.verificationLevel;
    const explicit = message.guild.explicitContentFilter;
    const twofaLevel = message.guild.mfaLevel;
    const defaultnotifs = message.guild.defaultMessageNotifications;
    const timestamp = message.guild.createdAt;

    const d = new Date(timestamp);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let strSeconds = d.getSeconds().toString();

    if (strSeconds.length === 1) {
      strSeconds = "0" + strSeconds;
    }

    var strTime = hours + ":" + minutes + ":" + strSeconds + " " + ampm;

    let date = strTime + ", " + d.toDateString();

    embed.addFields(
      {
        name: "Member count: ",
        value: `${memberCount}`,
      },
      {
        name: "Maximum members: ",
        value: `${maxMembers}`,
      },
      {
        name: "Server ID: ",
        value: `${id}`,
      },
      {
        name: "Shard ID: ",
        value: `${shardID}`,
      },
      {
        name: "Server name: ",
        value: `${name}`,
      },
      {
        name: "Icon hash: ",
        value: `${iconHash}`,
      },
      {
        name: "Region",
        value: `${region}`,
      },
      {
        name: "AFK timeout: ",
        value: `${afkTimeout} seconds`,
      },
      {
        name: "Boost count: ",
        value: `${boosts}`,
      },
      {
        name: "Boost level: ",
        value: `${boostLevel}`,
      },
      {
        name: "Verification Level: ",
        value: `${verification}`,
      },
      {
        name: "Explicit content filter: ",
        value: `${explicit}`,
      },
      {
        name: "2FA Level: ",
        value: `${twofaLevel}`,
      },
      {
        name: "Default notification level: ",
        value: `${defaultnotifs}`,
      },
      {
        name: "Date created: ",
        value: `${date}`,
      }
    );

    message.channel.send(embed);
  }
};
