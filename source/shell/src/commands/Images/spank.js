const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "spank",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "spank_img_command",
      description: "Ow my ass",
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

    const target = message.mentions.users.first()
      ? message.author
      : client.user;
    if (!target) return message.reply("No target given.");

    const pfp = target.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    const target2 = message.mentions.users.first()
      ? message.mentions.users.first()
      : message.author;
    const pfp2 = target2.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    canvacord.spank(pfp, pfp2).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("spank.png");

      message.channel.send(att);
    });
  }
};
