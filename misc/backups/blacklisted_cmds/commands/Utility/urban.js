const urban = require("relevant-urban");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "urban",
      aliases: ["uirbandic", "define", "dictionary", "meaning"],
      group: "util",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "urban_util_command",
      description: "urban dictionary",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
      throttling: {
        usages: 2,
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
    if (!args[0]) return message.channel.send("Please specify the query.");

    let text = args[0];

    let result = await urban(text).catch((e) => {
      return message.channel.send(
        `Unknown word phrase of **${text}**, please try again.`
      );
    });

    let definition = result.definition.replace(/\[/g, "").replace(/\]/g, "");
    let example = result.example.replace(/\[/g, "").replace(/\]/g, "");

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(result.word)
      .setURL(result.urbanURL)
      .setDescription(
        `**Definition:**\n${definition}\n\n**Example:**\n${example}`
      )
      .addField("Author", result.author, true)
      .addField(
        "Rating",
        `👍 ${result.thumbsUp.toLocaleString()} | 👎 ${result.thumbsDown.toLocaleString()}`
      );

    if (result.tags.length > 0 && result.tags.join(" ").length < 1024) {
      embed.addField("Tags", result.tags.join(", "), true);
    }

    return message.channel.send(embed);
  }
};
