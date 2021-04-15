const discordXP = require("discord-xp");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "required",
      aliases: ["req", "rankto"],
      group: "leveling",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "rankto_command",
      description: "Sends the required xp to next level.",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: false,
      throttling: {
        usages: 3,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    let level = parseInt(args[0]);
    if (isNaN(level)) {
      return message.channel.send("Specify a **number** to search please.");
    }

    if (level > 100) {
      return message.reply(
        "Levels only go up to 100! At this moment. Try a lower number"
      );
    }
    const target = message.author;
    let XPuser = await discordXP.fetch(target.id, message.guild.id);
    if (!XPuser) {
      let requiredXP = discordXP.xpFor(level);

      message.channel.send(
        `The required XP to reach level ${level} is **${requiredXP}**.`
      );
    } else {
      let requiredXP = discordXP.xpFor(XPuser.level + 1);

      message.channel.send(
        `XP needed for level *${level}* : **${XPuser.xp}/${requiredXP}**.`
      );
    }
  }
};

/**
 *  const prefix = message.guild.commandPrefix;
 
    let level = parseInt(args[0]);
    if (isNaN(level))
      return message.channel.send("Specify a **number** to search please.");

    let requiredXP = discordXP.xpFor(level);

    message.channel.send(
      `The required XP to reach level ${level} is **${requiredXP}**.`
    );
 */
