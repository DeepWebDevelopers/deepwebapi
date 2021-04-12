const discordXP = require("discord-xp");
const Discord = require("discord.js");
module.exports = {
  name: "setxp",
  minArgs: 1,
  maxArgs: 2,
  expectedArgs: "[mention] <xp>",
  description: "Set the XP of someone's xp profile",
  category: "Leveling",
  requiredPermissions: ["ADMINISTRATOR"],
  run: async ({ message, args, text, client, prefix, instance }) => {
    let target = message.mentions.members.first();

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
  },
};
