const canvacord = require("canvacord");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "xp",
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
    // ! Checks if the user is blacklisted or not!
    if (await isBlacklisted(message)) return;

    async function isBlacklisted(message) {
      const blacklist = require("../../db/blacklist");
      var isBanned = false;
      await blacklist.findOne(
        {
          userID: message.author.id,
        },
        (err, data) => {
          if (err) throw err;
          if (data) {
            isBanned = true;
            return message.reply(
              "You are blacklisted from using the bot! \n For more information on why, join our support server."
            );
          }
        }
      );
      if (isBanned) return true;
      return false;
    }
    const prefix = message.guild.commandPrefix;

    // ! old rank system - not used as it filters all members in lb.
    // const discordXP = require("discord-xp");
    // const target = message.mentions.users.first() || message.author;
    // let XPuser = await discordXP.fetch(target.id, message.guild.id);
    // if (!XPuser)
    //   return message.channel.send(
    //     `Seems like ${target.tag} does not have any XP.`
    //   );

    // if (!XPuser && message.author)
    //   return message.channel.send(
    //     `Seems like you don't have any XP. keep chatting to gain some!`
    //   );

    // let requiredXP = discordXP.xpFor(XPuser.level + 1);
    // const rawLeaderboard = await discordXP.fetchLeaderboard(
    //   message.guild.id,
    //   message.guild.memberCount
    // );

    // const leaderboard = await discordXP
    //   .computeLeaderboard(message.client, rawLeaderboard)
    //   .then((lb) => {
    //     for (let i = 0; i < lb.length; i++) {
    //       if (lb[i].userID === target.id) {
    //         return lb[i].position;
    //       }
    //     }
    //   });

    // const rankCard = new canvacord.Rank()
    //   .setAvatar(
    //     target.displayAvatarURL({
    //       dynamic: false,
    //       format: "png",
    //     })
    //   )
    //   .setCurrentXP(XPuser.xp)
    //   .setRequiredXP(requiredXP)
    //   .setStatus(target.presence.status, true)
    //   .setProgressBar("#7289da")
    //   .setUsername(target.username)
    //   .setDiscriminator(target.discriminator)
    //   .setLevel(XPuser.level)
    //   .setRank(leaderboard);
    // rankCard.build().then((data) => {
    //   const attachment = new Discord.MessageAttachment(data, "rankCard.png");
    //   message.channel.send(attachment);
    // });

    // ! - new rank system from update
    const Levels = require("discord-xp");

    const target = message.mentions.users.first() || message.author; // Grab the target.

    const user = await Levels.fetch(target.id, message.guild.id, true); // Selects the target from the database.
    if (!user) {
      return message.reply("You dont have any xp yet! keep chatting!");
    }

    const rank = new canvacord.Rank() // Build the Rank Card
      .setAvatar(target.displayAvatarURL({ format: "png", size: 512 }))
      .setCurrentXP(user.xp) // Current User Xp
      .setRequiredXP(Levels.xpFor(user.level + 1)) // We calculate the required Xp for the next level
      .setRank(user.position) // Position of the user on the leaderboard
      .setLevel(user.level) // Current Level of the user
      .setStatus(target.presence.status)
      .setProgressBar("#FFFFFF")
      .setUsername(target.username)
      .setDiscriminator(target.discriminator);

    rank.build().then((data) => {
      const attachment = new Discord.MessageAttachment(data, "RankCard.png");
      message.channel.send(attachment);
    });
  }
};
