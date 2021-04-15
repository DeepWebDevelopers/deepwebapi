const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "guildlist",
      aliases: ["serverlist", "showservers"],
      group: "owner",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "guild_list_command",
      description: "Shows a list of servers the bot is in.",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
      throttling: {
        usages: 3,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;
    let serverlist = "";
    message.client.guilds.cache.forEach((guild) => {
      serverlist = serverlist.concat(
        "** - **" +
          guild.name +
          "| ID: " +
          guild.id +
          `| Members:` +
          guild.memberCount +
          "\n\n"
      );
    });

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Servers that have \`${message.client.user.username}\` Bot`, "")
      .setDescription(serverlist);
    message.channel.send({ embed });
  }
};
