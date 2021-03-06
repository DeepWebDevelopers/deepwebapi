const Discord = require("discord.js");
const commando = require("discord.js-commando");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "whois",
      aliases: ["user"],
      group: "information",
      userPermissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY"],
      clientPermissions: ["SEND_MESSAGES"],
      memberName: "who_is_command",
      description: "Gives infromation on a user.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 45,
      },
    });
  }
  async run(message, args) {
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
    const moment = require("moment");

    const status = {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline/Invisible",
    };
    var permissions = [];
    var acknowledgements = "None";
    let whoisPermErr = new Discord.MessageEmbed()
      .setTitle("**User Permission Error!**")
      .setDescription("**Sorry, you don't have permissions to use this! ❌**");

    if (!message.channel.permissionsFor(message.author).has("MANAGE_MESSAGES"))
      return message.channel.send(whoisPermErr);

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    if (member.hasPermission("KICK_MEMBERS")) {
      permissions.push("Kick Members");
    }

    if (member.hasPermission("BAN_MEMBERS")) {
      permissions.push("Ban Members");
    }

    if (member.hasPermission("ADMINISTRATOR")) {
      permissions.push("Administrator");
    }

    if (member.hasPermission("MANAGE_MESSAGES")) {
      permissions.push("Manage Messages");
    }

    if (member.hasPermission("MANAGE_CHANNELS")) {
      permissions.push("Manage Channels");
    }

    if (member.hasPermission("MENTION_EVERYONE")) {
      permissions.push("Mention Everyone");
    }

    if (member.hasPermission("MANAGE_NICKNAMES")) {
      permissions.push("Manage Nicknames");
    }

    if (member.hasPermission("MANAGE_ROLES")) {
      permissions.push("Manage Roles");
    }

    if (member.hasPermission("MANAGE_WEBHOOKS")) {
      permissions.push("Manage Webhooks");
    }

    if (member.hasPermission("MANAGE_EMOJIS")) {
      permissions.push("Manage Emojis");
    }

    if (permissions.length == 0) {
      permissions.push("No Key Permissions Found");
    }

    if (member.user.id == message.guild.ownerID) {
      acknowledgements = "Server Owner";
    }

    const embed = new Discord.MessageEmbed()
      .setDescription(`<@${member.user.id}>`)
      .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
      .setColor("#2F3136")
      .setFooter(`ID: ${message.author.id}`)
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()
      .addField("__Status__", `${status[member.user.presence.status]}`, true)
      .addField(
        "__Joined at:__ ",
        `${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`,
        true
      )
      .addField("__Created On__", member.user.createdAt.toLocaleString(), true)
      .addField(
        `\n__Roles [${
          member.roles.cache
            .filter((r) => r.id !== message.guild.id)
            .map((roles) => `\`${roles.name}\``).length
        }]__`,
        `${
          member.roles.cache
            .filter((r) => r.id !== message.guild.id)
            .map((roles) => `<@&${roles.id}>`)
            .join(" **|** ") || "No Roles"
        }`,
        true
      )
      .addField("\n__Acknowledgements:__ ", `${acknowledgements}`, true)
      .addField("\n__Permissions:__ ", `${permissions.join(` | `)}`);

    message.channel.send({ embed });
  }
};
