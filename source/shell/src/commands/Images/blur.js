const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "blur",
      aliases: ["blurpfp"],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "blur_img_command",
      description: "Blur a profile picture.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 15,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    const target = message.mentions.users.first() || message.author;
    const pfp = target.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    canvacord.blur(pfp).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("blur.png");

      message.channel.send(att);
    });
  }
};
