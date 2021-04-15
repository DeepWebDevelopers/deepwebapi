const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "darkness",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "darkness_img_command",
      description: "",
      argsType: "multiple",
      guildOnly: true,
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

    const target = message.mentions.users.first() || message.author;
    const pfp = target.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    const amount = parseInt(args[message.mentions.users.first() ? 1 : 0]);
    if (isNaN(amount))
      return message.channel.send("The intensity has to be a numeric value.");

    canvacord.darkness(pfp, amount).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("darkness.png");

      message.channel.send(att);
    });
  }
};
