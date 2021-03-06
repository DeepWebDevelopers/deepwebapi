const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "colorfy",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "colorfy_img_command",
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

    let color = message.mentions.users.first() ? args[1] : args[0];

    if (message.mentions.users.first() && args.length < 2)
      return message.channel.send("Please specify the hex color value.");

    if (color.includes("#")) {
      const target = message.mentions.users.first() || message.author;
      const pfp = target.displayAvatarURL({
        dynamic: false,
        format: "png",
      });

      canvacord.colorfy(pfp, color).then((data) => {
        let att = new Discord.MessageAttachment()
          .setFile(data)
          .setName("colorfy.png");

        message.channel.send(att);
      });
    } else
      return message.channel.send(
        "Please include the `#` before the hex value."
      );
  }
};
