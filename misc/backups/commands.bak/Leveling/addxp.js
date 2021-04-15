const discordXP = require("discord-xp");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "addxp",
      aliases: ["+xp"],
      group: "leveling",
      userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "add_xp_command",
      description: "Adds xp to the user",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    if (!args[0]) return message.reply("You can give nothing a xp...");
    const prefix = message.guild.commandPrefix;
    let target = message.mentions.members.first();

    if (target) {
      let amountToAdd = parseInt(args[1]);
      if (isNaN(amountToAdd))
        return message.channel.send("Specify a **number** please.");

      discordXP.appendXp(target.id, message.guild.id, amountToAdd);
      setTimeout(async () => {
        let XPuser = await discordXP.fetch(target.id, message.guild.id);

        message.channel.send(
          `${message.author} has given **${amountToAdd}** XP to ${target}, they now have **${XPuser.xp}** XP.`
        );
      }, 1000);
    } else if (!target) {
      let amountToAdd = parseInt(args[0]);
      if (isNaN(amountToAdd))
        return message.channel.send("Specify a **number** please.");

      discordXP.appendXp(message.author.id, message.guild.id, amountToAdd);
      setTimeout(async () => {
        let XPuser = await discordXP.fetch(message.author.id, message.guild.id);

        message.reply(
          `I have given you **${amountToAdd}** XP, you now have **${XPuser.xp}** XP.`
        );
      }, 1000);
    }
  }
};
