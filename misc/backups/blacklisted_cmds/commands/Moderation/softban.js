const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "softban",
      aliases: ["sban"],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES", "BAN_MEMBERS"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "BAN_MEMBERS"],
      memberName: "soft_ban_command",
      description: "Ban a mamber for x ammount of time.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 60,
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

    if (!message.guild.me.hasPermission("BAN_MEMBERS"))
      return message.channel.send(
        "**I Dont Have The Permissions To Ban Users! - [BAN_MEMBERS]**"
      );
    message.channel.send("Command coming soon.");
  }
};
