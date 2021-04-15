const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "youtube",
      aliases: ["yt-cm"],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "youtube_img_command",
      description: "youtube comment clone",
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

    if (!text) return message.reply("No text given for youtube comment clone.");

    const options = {
      username: message.member.displayName,
      content: text,
      avatar: message.author.displayAvatarURL({
        dynamic: false,
        format: "png",
      }),
    };
    canvacord.youtube(options).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("comment.png");

      message.channel.send(att);
      if (!data) return;
    });
  }
};
