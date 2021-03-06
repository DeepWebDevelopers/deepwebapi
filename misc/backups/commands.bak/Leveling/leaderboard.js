const discordXP = require("discord-xp");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "leaderboard",
      aliases: ["lb"],
      group: "leveling",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "leaderboard_command",
      description: "Top 10 most active members",
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

    const rawLeaderboard = await discordXP.fetchLeaderboard(
      message.guild.id,
      10
    );
    if (rawLeaderboard.length < 1)
      return message.channel.send("Nobody is in the leaderboard yet...");

    const leaderboard = discordXP.computeLeaderboard(
      message.client,
      rawLeaderboard
    );
    const lb = (await leaderboard).map(
      (e) =>
        `**${e.position}.** ${e.username}#${e.discriminator}\nLevel: ${
          e.level
        }\nXP: ${e.xp.toLocaleString()}`
    );

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Most active members in ${message.guild.name}`)
      .setAuthor(message.author.tag, message.author.avatarURL())
      .setDescription(`${lb.join("\n\n")}`)
      .setThumbnail(message.client.user.avatarURL())
      .setTimestamp()
      .setFooter("Thank you for using Terminal!");

    message.channel.send(embed);
  }
};
