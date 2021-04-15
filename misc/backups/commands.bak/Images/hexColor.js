const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "hexcolor",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "hexcolor_img_command",
      description: "Convert hex to color.",
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

    let text = args.join(" ");

    if (!text) return message.reply("No arguments passed for convertion.");

    if (text.includes("#")) {
      let data = canvacord.color(text, true, 500, 1000);
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("hexcolor.png");

      message.channel.send(
        "**Background:** hex color\n**Text color:** inverted hex color",
        att
      );
    } else
      return message.channel.send(
        "Please include the `#` before the hex value."
      );
  }
};
