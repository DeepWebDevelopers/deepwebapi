const math = require("mathjs");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "math",
      aliases: ["equation", "calc"],
      group: "util",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "math_util_command",
      description: "",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
      throttling: {
        usages: 3,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    if (!args[0]) return message.channel.send("Input a calculaton");

    let resp;

    try {
      resp = math.evaluate(args.join(" "));
    } catch (e) {
      return message.channel.send("Sorry, invalid calculation.");
    }

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("Calculator")
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setThumbnail(message.client.user.avatarURL())
      .setTimestamp()
      .setFooter("Thank you for using Terminal!")
      .addField("Input: ", `\`\`\`${args.join(" ")}\`\`\``)
      .addField("Output", `\`\`\`${resp}\`\`\``);

    message.channel.send(embed);
  }
};
