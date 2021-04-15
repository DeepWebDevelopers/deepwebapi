const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "circle",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "circle_img_command",
      description: "Circle-ify a profile picture.",
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

    const target = message.mentions.users.first() || message.author;
    const pfp = target.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    canvacord.circle(pfp).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("circle.png");

      message.channel.send(att);
    });
  }
};
