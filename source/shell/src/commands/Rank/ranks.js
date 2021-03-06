const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const mongoose = require("mongoose");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "ranks",
      //   aliases: ["-rank"],
      group: "ranks",
      userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_ROLES"],
      memberName: "ranks_command",
      description: "Shows a list of current server ranks.",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true, // remove when command fixed - permissions
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

    const rankSchema = require("../../db/guild/ranks");

    try {
      rankSchema.find({ guildID: message.guild.id }, async (err, data) => {
        if (data) {
          let rankDataMap = data
            .map(({ rank, roleID }, index) => {
              return `#${index + 1} | **${rank}** => <@&${roleID}>`;
            })
            .join("\n");

          const rankShowEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle(`All ranks in **${message.guild.name}!**`)
            .setColor("RANDOM")
            .setFooter("Thank you for using Terminal!")

            .setDescription(rankDataMap);
          message.channel.send(rankShowEmbed);
        } else if (!data) {
          return message.reply("There are no ranks for this server!");
        }
      });
    } catch (error) {
      console.log(error);
      return message.reply(`ERROR: \n${error}`);
    }
  }
};
