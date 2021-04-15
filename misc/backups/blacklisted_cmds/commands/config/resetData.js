const Discord = require("discord.js");
const commando = require("discord.js-commando");
const logChannel = require("../../db/guild/logging");
const muterole = require("../../db/guild/muterole");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "reset",
      aliases: ["reset-settings"],
      group: "config",
      userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "reset_config_settings",
      description: "Resets the bots configuration settings",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 15,
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
    //Check for permissions
    if (message.author.id !== message.guild.ownerID) {
      const nopermsEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Setup unsuccessful")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription("You are not the owner of the server.")
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(nopermsEmbed);
      return;
    } else if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
      const nopermsEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Setup unsuccessful")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription(
          `I don't have the correct permissions. Try re-inviting me and adding **Administrator** permission. If this problem occurs, do **${prefix}info** support.`
        )
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(nopermsEmbed);
      return;
    } else {
      // ! Commands
      if (!args[0]) {
        //
        let argsembed = new Discord.MessageEmbed()
          .setTitle("Data Resets")
          .setDescription(
            `Use one of the commands to reset data of your choice.
            \`${prefix}reset verification\` Resets all your verification settings.
            \`${prefix}reset logchannel\` Resets the message log settings.
            \`${prefix}reset muterole\` Resets the mute settings.`
          )
          .setColor("#c28ada");
        message.channel.send(argsembed);
      } else if (message.author.bot || message.channel.type === "dm") {
        return;
      }
      let messageinfocontent = message.content.toLowerCase();
      switch (args[0]) {
        // ! Verification command
        case "verification":
          message.reply("comming soon...");

          break;
        case "logchannel":
          if (!logChannel)
            return message.reply(
              `There is no log channel setup. Try **${prefix}setlogs**`
            );
          logChannel.deleteOne({ guildID: message.guild.id }, (err) =>
            console.log(err)
          );
          let messagelogembed = new Discord.MessageEmbed()
            .setTitle("Data Reset")
            .setDescription("Your message log channel data has been deleted.")
            .setColor("GREEN");
          message.channel.send(messagelogembed);
          break;
        case "muterole":
          // ! Mute role command
          muterole.deleteOne({ guildID: message.guild.id }, (err) =>
            console.log(`Mute reset Pushed events: ${err} | muterole.js`)
          );
          let allembed = new Discord.MessageEmbed()
            .setTitle("Data Reset")
            .setDescription("The mute role has been reset.")
            .setColor("GREEN");
          message.channel.send(allembed);
          break;
      }
    }
  }
};
