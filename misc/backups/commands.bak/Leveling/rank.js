const discordXP = require("discord-xp");
const canvacord = require("canvacord");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "rank",
      aliases: ["level"],
      group: "leveling",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "rank_command",
      description: "Shows the users rank in the server.",
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

    const target = message.mentions.users.first() || message.author;
    let XPuser = await discordXP.fetch(target.id, message.guild.id);
    if (!XPuser)
      return message.channel.send(
        `Seems like ${target.tag} does not have any XP.`
      );

    if (!XPuser && message.author)
      return message.channel.send(
        `Seems like you don't have any XP. keep chatting to gain some!`
      );

    let requiredXP = discordXP.xpFor(XPuser.level + 1);
    const rawLeaderboard = await discordXP.fetchLeaderboard(
      message.guild.id,
      message.guild.memberCount
    );

    const leaderboard = await discordXP
      .computeLeaderboard(message.client, rawLeaderboard)
      .then((lb) => {
        for (let i = 0; i < lb.length; i++) {
          if (lb[i].userID === target.id) {
            return lb[i].position;
          }
        }
      });

    const rankCard = new canvacord.Rank()
      .setAvatar(
        target.displayAvatarURL({
          dynamic: false,
          format: "png",
        })
      )
      .setCurrentXP(XPuser.xp)
      .setRequiredXP(requiredXP)
      .setStatus(target.presence.status, true)
      .setProgressBar("#7289da")
      .setUsername(target.username)
      .setDiscriminator(target.discriminator)
      .setLevel(XPuser.level)
      .setRank(leaderboard);
    rankCard.build().then((data) => {
      const attachment = new Discord.MessageAttachment(data, "rankCard.png");
      message.channel.send(attachment);
    });
  }
};
