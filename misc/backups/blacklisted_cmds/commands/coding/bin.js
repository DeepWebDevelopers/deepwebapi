const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "soucebin",
      aliases: ["bin", "codebin"],
      group: "coding",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "source_bin_command",
      description: "Sends a text/code bin to the channel.",
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

    const embed = new MessageEmbed()

      .setTitle("Why Use a Paste Bin?")
      .setColor("#c28ada")
      .setDescription(
        "Its a bit ugly to send all your code / text in a discord channel, but using a bin will make viewing code a lot easier and user friendly for everyone! "
      )
      .addField(
        "Bins to use:",
        "[SourceBinLink](https://sourceb.in/), [HasteBinLink](https://hasteb.in/), [PasteNomsyLink](https://paste.nomsy.net/), [Pasteie.ioLink](https://pastie.io/)"
      )
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL())
      .setFooter(
        "Try to use a bin when showing lots of text.",
        message.author.displayAvatarURL()
      );

    message.channel.send(embed);
  }
};
