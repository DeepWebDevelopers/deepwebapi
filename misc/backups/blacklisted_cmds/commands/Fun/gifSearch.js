const fetch = require("node-fetch");
const { tenorAPI } = require("../../../config/config.json");
const { Command } = require("discord.js-commando");

module.exports = class GifCommand extends Command {
  constructor(client) {
    super(client, {
      name: "gif-search",
      aliases: ["gif", "random-gif", "search-gif"],
      group: "fun",
      memberName: "gif_search_command",
      description: "Provide a query and replies with a gif!",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 25,
      },
      args: [
        {
          key: "text",
          prompt: ":thinking: What gif would you like to view?",
          type: "string",
          validate: (text) => text.length < 50,
        },
      ],
    });
  }

  async run(message, { text }) {
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

    fetch(`https://api.tenor.com/v1/random?key=${tenorAPI}&q=${text}&limit=1`)
      .then((res) => res.json())
      .then((json) => message.say(json.results[0].url))
      .catch((e) => {
        message.say(":x: Failed to find a gif that matched your query!");
        // console.error(e);
        return;
      });
  }
};
