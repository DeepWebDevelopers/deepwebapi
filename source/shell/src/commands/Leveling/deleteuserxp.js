const discordXP = require("discord-xp");
const Discord = require("discord.js");
module.exports = {
  name: "deleteuserxp",
  aliases: ["duxp"],
  minArgs: 0,
  maxArgs: 1,
  expectedArgs: "[mention]",
  requiredPermissions: ["ADMINISTRATOR"],
  description: "Deletes xp entry in the database",
  category: "Leveling",
  run: async ({ message, args, text, client, prefix, instance }) => {
    if (message.author.id !== message.guild.ownerID) {
      const nopermsEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Delete user XP unsuccessful")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription("You are not the owner of the server.")
        .setThumbnail(message.client.user.avatarURL())
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");
      message.channel.send(nopermsEmbed);
      return;
    }

    let target = message.mentions.members.first() || message.author;
    discordXP.deleteUser(target.id, message.guild.id);

    message.channel.send(`Deleted XP database for ${target}.`);
  },
};
