const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "pornhub",
      aliases: ["phub"],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "pornhub_img_command",
      description: "upload to the hub safely ^_*",
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

    if (!text)
      return message.reply(
        "You did not give me any text to upload to the hub sir."
      );

    const options = {
      username: message.member.displayName,
      message: text,
      image: message.author.displayAvatarURL({
        dynamic: false,
        format: "png",
      }),
    };

    if (!options) return;

    canvacord.phub(options).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("phub.png");

      message.channel.send(att);
    });
  }
};
