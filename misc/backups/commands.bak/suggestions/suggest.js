const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "suggest",
      //   aliases: [""],
      group: "suggestions",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "ADD_REACTIONS"],
      memberName: "suggest_command",
      description: "suggest something.",
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

    const suggestionQuery = args.join(" ");

    if (!suggestionQuery) {
      return message.reply("Enter a message to suggest.");
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor(
        `${message.author.tag} ID:(${message.author.id})`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(`**Suggestion:** ${suggestionQuery}`)
      .setColor("ORANGE")
      .setTimestamp()
      .addField("Status", "PENDING");

    await message.react("🚀");
    message.guild.channels.cache.get("832066862614577192").send(embed); // suggestions channel
  }
};
