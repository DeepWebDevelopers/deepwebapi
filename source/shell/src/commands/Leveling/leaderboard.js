const discordXP = require("discord-xp");
const Discord = require("discord.js");
module.exports = {
  name: "leaderboard",
  aliases: ["lb"],
  minArgs: 0,
  maxArgs: 0,
  description: "Top 10 most active members",
  category: "Leveling",
  run: async ({ message, args, text, client, prefix, instance }) => {
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
  },
};
