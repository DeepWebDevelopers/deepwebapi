const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "accept-suggestion",
      aliases: ["accept-s"],
      group: "suggestions",
      userPermissions: ["SEND_MESSAGES", "MANAGE_GUILD"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "accept_suggestion_command",
      description: "accept a suggestion",
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

    const messageID = args[0];

    if (!messageID)
      return message.reply(
        "You need to enter the id of the suggestion you wish to accept!"
      );

    const acceptQuery = args.slice(1).join(" ");

    if (!acceptQuery)
      return message.reply("Please give a reason for accepting!");

    try {
      const suggestionChannel = message.guild.channels.cache.get(
        "832066862614577192"
      );
      const suggestedEmbed = await suggestionChannel.messages.fetch(messageID);

      const data = suggestedEmbed.embeds[0];
      const acceptEmbed = new Discord.MessageEmbed()
        .setAuthor(data.author.name, data.author.iconURL)
        .setDescription(data.description)
        .setColor("GREEN")
        .addField("Status (ACCEPTED)", `Reason: ${acceptQuery}`);

      suggestedEmbed
        .edit(acceptEmbed)
        .then(message.channel.send("Suggestion accepted!"))
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
