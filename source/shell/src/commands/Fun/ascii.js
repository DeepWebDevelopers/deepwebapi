const figlet = require("figlet");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "ascii",
      // aliases: [""],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "ascii_fun_command",
      description: "Send an ascii message",
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

    if (!args[0]) return message.reply("Please give me some text to `ascii` ");

    //Combine all the arguments to a single string
    const arg = args.slice(0).join(" ");

    //Use the string to convert it to ascii, if there is an error, cancel, if the text is too large, cancel, if not, send
    figlet.text(arg, function (err, data) {
      if (err) return message.channel.send("Something went wrong");

      if (data.length > 2000)
        return message.channel.send(
          "Too much text to output, for the love of god, don't type an entire essay."
        );

      //Ascii must be used with a monospaced font
      message.channel.send(`\`\`\`\n${data}\n\`\`\``);
    });
  }
};
