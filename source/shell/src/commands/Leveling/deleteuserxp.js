const discordXP = require("discord-xp");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "deleteuserxp",
      aliases: ["duxp"],
      group: "leveling",
      userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "deleteuserxp_command",
      description: "Removed Xp from a user.",
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
  }
};
