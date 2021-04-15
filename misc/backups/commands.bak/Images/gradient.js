const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "gradient",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "gradient_img_command",
      description: "create a hex gradient",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    if (!args[0]) return message.reply("no arguments given...");

    if (args[0].includes("#") && args[1].includes("#")) {
      let data = canvacord.gradient(args[0], args[1], 1000, 500);
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("gradient.png");

      message.channel.send(att);
    } else
      return message.channel.send(
        "Please include the `#` before both hex values."
      );
  }
};
