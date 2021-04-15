const warnSchema = require("../../db/warn");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "warnings",
      aliases: ["warns"],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "VIEW_AUDIT_LOG"],
      memberName: "",
      description: "",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 60,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    let target = message.mentions.users.first() || message.author;
    if (!target) return message.reply("I cant find that user.");
    let guildId = message.guild.id;
    let userId = target.id;

    try {
      let data = await warnSchema.findOne({
        warnId: userId,
        guildId: guildId,
      });

      if (!data && message.author) {
        return message.channel.send(
          "You have have any warnings for me to show! :D"
        );
      }

      if (!data)
        return message.channel.send(`${target.tag} has no warnings. :)`);

      const embed = new Discord.MessageEmbed()
        .setColor("YELLOW")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setTitle(`Previous warnings for ${target.tag}`)
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");

      let warnlist = "";

      for (const warn of data.warnings) {
        const { warnDate, staffId, staffTag, reason } = warn;

        warnlist += `\`${reason}\` • On ${new Date(
          warnDate
        ).toLocaleString()} by ${staffTag}\n`;
      }

      embed.setDescription(warnlist);
      message.channel.send(embed);
    } catch (err) {
      console.log(err);
      message.channel.send(`An error occurred: \`${err.message}\``);
    }
  }
};
