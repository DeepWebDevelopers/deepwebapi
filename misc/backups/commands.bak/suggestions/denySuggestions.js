const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "deny-suggestions",
      aliases: ["deny-s"],
      group: "suggestions",
      userPermissions: ["SEND_MESSAGES", "MANAGE_GUILD"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "deny_suggestion_command",
      description: "deny a suggestion",
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

    const messageID = args[0];

    if (!messageID)
      return message.reply(
        "You need to enter the id of the suggestion you wish to accept!"
      );

    const denyQuery = args.slice(1).join(" ");

    if (!denyQuery) return message.reply("Please give a reason for accepting!");

    try {
      const suggestionChannel = message.guild.channels.cache.get(
        "832066862614577192"
      );
      const suggestedEmbed = await suggestionChannel.messages.fetch(messageID);

      const data = suggestedEmbed.embeds[0];
      const denyEmbed = new Discord.MessageEmbed()
        .setAuthor(data.author.name, data.author.iconURL)
        .setDescription(data.description)
        .setColor("RED")
        .addField("Status (DENYED)", `Reason: ${denyQuery}`);

      suggestedEmbed
        .edit(denyEmbed)
        .then(message.channel.send("Suggestion denied!"))
        .catch((err) => {
          console.log(err);
          message.reply("Could not edit msg. Try again.");
        });
    } catch (err) {
      message.reply("This suggestion does not exist!");
      return console.log(err);
    }
  }
};
