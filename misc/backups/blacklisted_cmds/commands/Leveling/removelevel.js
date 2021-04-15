const discordXP = require("discord-xp");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "removelevel",
      aliases: ["-lvl"],
      group: "leveling",
      userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "removelevel_command",
      description: "Remove levels from someone's xp profile.",
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

    let target = message.mentions.members.first();

    if (target) {
      let amountToremove = parseInt(args[1]);
      if (isNaN(amountToremove))
        return message.channel.send("Specify a **number** please.");

      discordXP.subtractLevel(target.id, message.guild.id, amountToremove);
      setTimeout(async () => {
        let XPuser = await discordXP.fetch(target.id, message.guild.id);

        if (!XPuser)
          return message.channel.send(
            `Seems like ${target} has less amount of levels than the amount you are subtracting, or they have no level.`
          );

        message.channel.send(
          `${message.author} has taken **${amountToremove}** levels away from ${target}, they are now at level **${XPuser.level}**.`
        );
      }, 1000);
    } else if (!target) {
      let amountToremove = parseInt(args[0]);
      if (isNaN(amountToremove))
        return message.channel.send(
          "Specify the **number** of lvl's to remove please."
        );

      discordXP.subtractLevel(
        message.author.id,
        message.guild.id,
        amountToremove
      );
      setTimeout(async () => {
        let XPuser = await discordXP.fetch(message.author.id, message.guild.id);

        message.reply(
          `I have taken **${amountToremove}** levels from you, you are now at level **${XPuser.level}**.`
        );
      }, 1000);
    }
  }
};
