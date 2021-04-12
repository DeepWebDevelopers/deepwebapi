const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "kiss",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "kiss_img_command",
      description: "kiss them!",
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

    const target1 = message.author;
    if (!target1) return;
    const pfp = target1.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    const target2 = message.mentions.users.first();
    if (!target2) return message.reply("You did not mention a valid user.");
    if (target2 === message.client.user)
      return message.reply("I dont want your kisses.");
    if (target2 === message.author)
      return message.reply("Your a freak for trying that kid!");
    const pfp2 = target2.displayAvatarURL({
      dynamic: false,
      format: "png",
    });

    canvacord.kiss(pfp, pfp2).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("kiss.png");

      message.channel.send(att);

      if (!data) return message.reply("Err getting data from canvacord :/");
    });
  }
};
