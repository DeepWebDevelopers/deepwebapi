const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const mongoose = require("mongoose");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "delrank",
      //   aliases: ["-rank"],
      group: "ranks",
      userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_ROLES"],
      memberName: "remove_rank_command",
      description: "removes a rank role to a member.",
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

    const rankName = args.join(" ");

    if (!rankName) {
      let embed = new Discord.MessageEmbed()
        .setTitle("ERROR invalid rank format")
        .setColor("RED")
        .setDescription(`Correct format: \`${prefix}delrank <rank name>\``)
        .setFooter("For help join our support server!");
      return message.reply(embed);
    }

    const rankSchema = require("../../db/guild/ranks");

    try {
      rankSchema.findOne(
        { guildID: message.guild.id, rank: rankName },

        async (err, data) => {
          if (err) throw err;
          if (!rankSchema) {
            return message.reply("no ranks setup yet.");
          } else {
            if (data) {
              await rankSchema
                .findOneAndDelete({ guildID: message.guild.id, rank: rankName })
                .then((result) => console.log(result))
                .then(message.reply("You rank has been removed!"));
            } else {
              return message.channel.send(
                `That rank does not exist! Check \`${prefix}ranks\` for the correct spelling.`
              );
            }
          }
        }
      );
    } catch (error) {
      console.log(error);
      return message.reply(`ERROR: \n${error}`);
    }
  }
};
