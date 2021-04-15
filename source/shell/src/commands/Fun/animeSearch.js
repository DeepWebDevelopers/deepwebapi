const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");

module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "animesearch",
      aliases: ["anifind", "anisearch"],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "anime_search_command",
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
    const prefix = message.guild.commandPrefix;

    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */

    const { searchAnime } = require("@freezegold/anime.js");

    const query = args.join(" ");
    if (!query) return message.reply("Please type a name of an anime!");
    const anime = await searchAnime(query, 1).then((res) => {
      return res[0];
    });
    function trim(input) {
      return input.length > 1024 ? `${input.slice(0, 1015)} [...]` : input;
    }

    try {
      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(
          anime.titles.english,
          "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
        )
        .setTitle("Anime")
        .addFields(
          {
            name: "Titles: ",
            value: anime.titles.english
              ? `➥ English: ${anime.titles.english}\n`
              : "➥ English: :x:\n" +
                `➥ Romaji: ${anime.titles.romaji}\n` +
                `➥ Japanese: ${anime.titles.japanese}`,
            inline: true,
          },
          {
            name: "Ratings: ",
            value:
              `➥ Watchers: ${anime.userCount}\n` +
              `➥ Favourites: ${anime.favoritesCount}\n` +
              `➥ Ratings: ${anime.averageRating} ⭐`,
            inline: true,
          },
          {
            name: "Synopsis: ",
            value: trim(anime.synopsis),
            inline: false,
          }
        )
        .setFooter("Thank you for using Terminal!")
        .setThumbnail(anime.posterImage.original)
        .setTimestamp();

      message.reply(embed);
    } catch (e) {
      console.log(e);
      return message.reply("Cant find your query! `Check your spelling!`");
    }
  }
};
