const fetch = require("node-fetch");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "docs",
      aliases: ["docsjs"],
      group: "coding",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "discord_js_docs_command",
      description: "search the discord js docs.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    var [query, branch] = args;

    if (!query) return message.channel.send("Please include a search query!");
    if (!branch) branch = "master";

    fetch(
      `https://djsdocs.sorta.moe/v2/embed?src=${branch}&q=${encodeURIComponent(
        query
      )}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (!json) return message.channel.send("Not found!");

        message.channel.send({ embed: json });
      })
      .catch(() => {
        message.channel.send("Couldn't fetch docs!");
      });
  }
};
