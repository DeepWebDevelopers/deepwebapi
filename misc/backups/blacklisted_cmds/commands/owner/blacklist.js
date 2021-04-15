const blacklist = require("../../db/blacklist");
const mongo = require("../../../config/mongo");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "blacklist",
      aliases: ["bl"],
      group: "owner",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "owner_blacklist_command",
      description: "Added a user to the bots blacklist.",
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

    /**
     * @param {Message} message
     */

    const Target =
      message.guild.members.cache.get(args[0]) ||
      message.mentions.members.first();
    if (!Target) return message.channel.send("Enter someone to blacklist");

    blacklist.findOne({ userID: Target.user.id }, async (err, data) => {
      if (err) throw err;
      if (data) {
        message.channel.send(
          `**${Target.displayName}** has already been blacklisted!`
        );
      } else {
        data = new blacklist({
          userID: Target.user.id,
          userName: Target.user.name,
        });
        data.save().catch((err) => console.log(err));
        message.channel.send(
          `${Target.user.tag} has been added to my blacklist.`
        );
      }
    });
  }
};
