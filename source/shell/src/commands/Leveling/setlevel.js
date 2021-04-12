const discordXP = require("discord-xp");
const Discord = require("discord.js");
module.exports = {
  name: "setlevel",
  minArgs: 1,
  maxArgs: 2,
  expectedArgs: "[mention] <level>",
  description: "Set a level of someone's xp profile",
  category: "Leveling",
  requiredPermissions: ["ADMINISTRATOR"],
  run: async ({ message, args, text, client, prefix, instance }) => {
    let target = message.mentions.members.first();

    if (target) {
      if (!args[1]) return message.channel.send("To what level do I set?");
      let amountToAdd = parseInt(args[1]);
      if (isNaN(amountToAdd))
        return message.channel.send("Specify a **number** please.");

      discordXP.setLevel(target.id, message.guild.id, amountToAdd);
      setTimeout(async () => {
        let XPuser = await discordXP.fetch(target.id, message.guild.id);

        message.channel.send(
          `${message.author} has set ${target}'s level to **${amountToAdd}**.`
        );
      }, 1000);
    } else if (!target) {
      if (!args[0]) return message.channel.send("To what level do I set?");
      let amountToAdd = parseInt(args[0]);
      if (isNaN(amountToAdd))
        return message.channel.send("Specify a **number** please.");

      discordXP.setLevel(message.author.id, message.guild.id, amountToAdd);
      setTimeout(async () => {
        let XPuser = await discordXP.fetch(message.author.id, message.guild.id);

        message.reply(`I have set your level to **${amountToAdd}**.`);
      }, 1000);
    }
  },
};
