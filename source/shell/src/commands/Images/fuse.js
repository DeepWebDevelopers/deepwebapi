const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "fuse",
      aliases: ["fuse-pfp"],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "fuse_img_command",
      description: "fuse 2 profile pics",
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

    const target = message.author;

    const pfp = target.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    const target2 = message.mentions.users.first();
    if (!target2)
      return message.reply(
        "You can't facepalm nothing...these humans really stupid :/"
      );
    const pfp2 = target2.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    canvacord.fuse(pfp, pfp2).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("fuse.png");

      message.channel.send(att);
    });
  }
};
