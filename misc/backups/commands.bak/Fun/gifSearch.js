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

  run(message, { text }) {
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
