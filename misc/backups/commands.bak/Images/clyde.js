const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "clyde",
      // aliases: [""],
      group: "images",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "",
      description: "The default Clyde bot",
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

    let text = args.join(" ");
    if (!text) return message.reply("no text given.");

    canvacord.clyde(text).then((data) => {
      let att = new Discord.MessageAttachment()
        .setFile(data)
        .setName("clyde.png");

      message.channel.send(att);

      if (!data) {
        return message.reply(
          "There has been an error. I could not connect to canvacord."
        );
      }
    });
  }
};
