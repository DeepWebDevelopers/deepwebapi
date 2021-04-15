const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const mongoose = require("mongoose");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "addrank",
      aliases: ["+rank"],
      group: "ranks",
      userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_ROLES"],
      memberName: "add_rank_command",
      description: "Gives a rank role to a member.",
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

    const role = message.mentions.roles.first();
    const rankName = args.slice(1).join(" ");

    if (!role) {
      let embed = new Discord.MessageEmbed()
        .setTitle("ERROR invalid role format")
        .setColor("RED")
        .setDescription(
          `Correct format: \`${prefix}addrank <role> <rank name>\``
        )
        .setFooter("For help join our support server!");
      return message.reply(embed);
    }

    if (!rankName) {
      let embed = new Discord.MessageEmbed()
        .setTitle("ERROR invalid rank format")
        .setColor("RED")
        .setDescription(
          `Correct format: \`${prefix}addrank <role> <rank name>\``
        )
        .setFooter("For help join our support server!");
      return message.reply(embed);
    }

    const rankSchema = require("../../db/guild/ranks");

    try {
      rankSchema.findOne(
        { guildID: message.guild.id, rank: rankName },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            return message.reply("This rank already exist!");
          } else {
            data = new rankSchema({
              _id: mongoose.Types.ObjectId(),
              guildID: message.guild.id,
              guildName: message.guild.name,
              rank: rankName,
              roleID: role.id,
            });
            data.save();
            message
              .reply(`${role} has been set to rank > ${rankName}!`)
              .then(
                message.channel.send(`To remove this run \`${prefix}delrank\`.`)
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
