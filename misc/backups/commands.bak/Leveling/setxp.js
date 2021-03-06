const discordXP = require("discord-xp");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "setxp",
      // aliases: [""],
      group: "leveling",
      userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "setxp_command",
      description: "Set the XP of someone's xp profile",
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

    let target = message.mentions.members.first() || message.author;

    if (target) {
      let amountToAdd = parseInt(args[1]);
      if (isNaN(amountToAdd))
        return message.channel.send("Specify a **number** please.");

      discordXP.setXp(target.id, message.guild.id, amountToAdd);
      setTimeout(async () => {
        let XPuser = await discordXP.fetch(target.id, message.guild.id);

        message.channel.send(
          `${message.author} has set ${target}'s XP to **${amountToAdd}**.`
        );
      }, 1000);
    } else if (!target) {
      let amountToAdd = parseInt(args[0]);
      if (isNaN(amountToAdd))
        return message.channel.send("Specify a **number** please.");

      discordXP.setXp(message.author.id, message.guild.id, amountToAdd);
      setTimeout(async () => {
        let XPuser = await discordXP.fetch(message.author.id, message.guild.id);

        message.reply(`I have set your XP to **${amountToAdd}**.`);
      }, 1000);
    }
  }
};
