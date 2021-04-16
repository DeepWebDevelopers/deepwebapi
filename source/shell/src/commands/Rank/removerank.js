const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const mongoose = require("mongoose");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "removerank",
      //   aliases: ["-rank"],
      group: "ranks",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: [
        "SEND_MESSAGES",
        "VIEW_CHANNEL",
        "MANAGE_ROLES",
        "MANAGE_GUILD",
      ],
      memberName: "remove_rank_command",
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
      const rankName = args.join(" ");
      if (!rankName)
        return message.reply(
          `Enter a Rank name to add, or check the list of ranks with \`${prefix}ranks\``
        );

      rankSchema.findOne(
        { guildID: message.guild.id, rank: rankName },
        async (err, data) => {
          if (data) {
            //   let rankRoleFetch = data.map(({roleID, rank}, index) => {
            //       return roleID
            //   })
            // if (
            //     rankRoleFetch.position > message.guild.me.roles.highest.position
            // ) {
            //   return message.reply(
            //     "`❌` The provided role is higher than my role in the role hierarchy!"
            //   );
            // rankRoleFetch.position < message.guild.me.roles.highest.position
            message.member.roles.remove(data.roleID);
            let successEmbed = new Discord.MessageEmbed().setDescription(
              `I have removed the role **<@&${data.roleID}>** from your account                                                                   !`
            );
            return message.reply(successEmbed);
          } else {
            return message.reply(
              `The rank does not exist! Check: \`${prefix}ranks\``
            );
          }
        }
      );
    } catch (error) {
      console.log(error);
      return message.reply(`ERROR: \n${error}`);
    }
  }
};
