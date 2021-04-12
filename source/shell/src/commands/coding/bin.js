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
