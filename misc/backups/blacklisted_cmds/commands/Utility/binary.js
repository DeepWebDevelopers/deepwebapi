const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "binary",
      // aliases: [""],
      group: "util",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "binary_util_command",
      description: "Convert binary to text or the other way around.",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
      throttling: {
        usages: 2,
        duration: 20,
      },
    });
  }
  async run(message, args, client) {
    // ! Checks if the user is blacklisted or not!
    if (await isBlacklisted(message)) return;

    async function isBlacklisted(message) {
      const blacklist = require("../../db/blacklist");
      var isBanned = false;
      await blacklist.findOne(
        {
          userID: message.author.id,
        },
        (err, data) => {
          if (err) throw err;
          if (data) {
            isBanned = true;
            return message.reply(
              "You are blacklisted from using the bot! \n For more information on why, join our support server."
            );
          }
        }
      );
      if (isBanned) return true;
      return false;
    }
    const prefix = message.guild.commandPrefix;

    if (!args[0])
      return message.channel.send(
        "Unknown parameter. Please choose the method first, either decode or encode it."
      );

    let choice = ["encode", "decode"];
    if (!choice.includes(args[0].toLowerCase()))
      return message.channel.send(
        "Unknown parameter. Please choose the method first, either decode or encode it."
      );

    let textIn = args.slice(1).join(" ");

    if (!textIn) return message.channel.send("Please input some text.");

    if (textIn.length > 1024)
      return message.channel.send("Maximum input is 1024 characters, sorry!");

    function encode(char) {
      return char
        .split("")
        .map((str) => {
          const converted = str.charCodeAt(0).toString(2);
          return converted.padStart(8, "0");
        })
        .join(" ");
    }

    function decode(char) {
      return char
        .split(" ")
        .map((str) => String.fromCharCode(Number.parseInt(str, 2)))
        .join("");
    }

    if (args[0].toLowerCase() === "encode") {
      return message.channel.send(encode(textIn));
    } else if (args[0].toLowerCase() === "decode") {
      return message.channel.send(decode(textIn));
    }
  }
};
