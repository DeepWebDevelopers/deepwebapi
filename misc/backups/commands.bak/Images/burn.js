const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "burn",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "burn_img_command",
      description: "brun a pfp",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 35,
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

    const amount = parseInt(args[message.mentions.users.first() ? 1 : 0]);
    if (isNaN(amount))
      return message.channel.send("The intensity has to be a numeric value.");

    canvacord.burn(pfp, amount).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("burned.png");

      message.channel.send(att);
    });
  }
};
