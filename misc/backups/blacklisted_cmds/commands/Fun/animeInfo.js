const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");

module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "animeinfo",
      aliases: ["aniinfo", "aniinfo"],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "anime_find_command",
      description: "search for an anime",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: false,
      throttling: {
        usages: 2,
        duration: 30,
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

    const search = `${args}`;
    if (!search) return message.reply("Please add a search query!");

    const malScraper = require("mal-scraper");
    try {
      malScraper.getInfoFromName(search).then((data) => {
        const malEmbed = new Discord.MessageEmbed()
          .setAuthor(
            `My Anime List search result for ${args}`.split(",").join(" ")
          )
          .setThumbnail(data.picture)
          .setColor("RANDOM") //What ever u want color!
          .addField("Premiered", `\`${data.premiered}\``, true)
          .addField("Broadcast", `\`${data.broadcast}\``, true)
          .addField("Genres", `\`${data.genres}\``, true)
          .addField("English Title", `\`${data.englishTitle}\``, true)
          .addField("Japanese Title", `\`${data.japaneseTitle}\``, true)
          .addField("Type", `\`${data.type}\``, true)
          .addField("Episodes", `\`${data.episodes}\``, true)
          .addField("Rating", `\`${data.rating}\``, true)
          .addField("Aired", `\`${data.aired}\``, true)
          .addField("Score", `\`${data.score}\``, true)
          .addField("Favorite", `\`${data.favorites}\``, true)
          .addField("Ranked", `\`${data.ranked}\``, true)
          .addField("Duration", `\`${data.duration}\``, true)
          .addField("Studios", `\`${data.studios}\``, true)
          .addField("Popularity", `\`${data.popularity}\``, true)
          .addField("Members", `\`${data.members}\``, true)
          .addField("Score Stats", `\`${data.scoreStats}\``, true)
          .addField("Source", `\`${data.source}\``, true)
          .addField("Synonyms", `\`${data.synonyms}\``, true)
          .addField("Status", `\`${data.status}\``, true)
          .addField("Identifier", `\`${data.id}\``, true)
          .addField("Link", data.url, true)
          .setTimestamp()
          .setFooter(
            `Requested ${message.member.displayName}`,
            message.author.displayAvatarURL({ dynamic: true })
          );

        message.channel.send(malEmbed);
      });
    } catch (e) {
      console.log(e);
      return message.reply("Cant find your query! `Check your spelling!`");
    }
  }
};
