const sourcebin = require("sourcebin_js");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "sbin",
      aliases: ["sourceup", "superbin"],
      group: "coding",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "super_bin_command",
      description: "upload your text to a source bin",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 25,
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

    if (!args.join(" "))
      return message
        .reply(`Incorrect Syntax. Exmaple: ${prefix}<code/text>`)
        .then((m) => m.delete({ timeout: 4000 }));

    sourcebin
      .create([
        {
          name: `Code by ${message.author.tag}`,
          content: args.join(" "),
          languageId: "js",
        },
      ])
      .then((src) => {
        message.channel.send(`Here is a link to your code: ${src.url}.`);
      })
      .catch((e) => {
        message.channel.send(`Error, try again later`);
      });
  }
};
