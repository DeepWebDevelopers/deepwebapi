const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const canvacord = require("canvacord").Canvas;
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "affect",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "affect_img_command",
      description: "This does not affect my baby.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
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

    const target = message.mentions.users.first() || message.author;
    if (!target) return message.reply("You need to mention a user!");

    const pfp = target.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    canvacord.affect(pfp).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("affect.png");

      message.channel.send(att);
    });
  }
};
