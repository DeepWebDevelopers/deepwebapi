const axios = require("axios").default;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "wikipedia",
      aliases: ["wiki"],
      group: "util",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "wikipedia_util_command",
      description: "wikipedia searcher",
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

    let URL =
      "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=";

    let text = args[0];

    if (!text) return message.reply("You did not input a work to search.");

    var options = {
      method: "GET",
      url: URL + text,
    };

    axios.request(options).then(async (res) => {
      let names = [];
      let urls = [];
      let str = "";

      for (let i = 1; i < res.data[1].length; i++) {
        names.push(res.data[1][i]);
      }

      for (let j = 1; j < res.data[3].length; j++) {
        urls.push(res.data[3][j]);
      }

      for (let k = 0; k < names.length && k < urls.length; k++) {
        str += `[${names[k]}](${urls[k]})\n`;
      }

      if (str.length > 2048) str = str.substr(0, 2048);

      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(message.author.displayAvatarURL())
        .setTitle(`Showing search results for ${res.data[0]}`)
        .setDescription(str)
        .setFooter("Each link redirects you to its respectful Wikipedia page")
        .setTimestamp()
        .setURL(res.data[3][0]);

      message.channel.send(embed);
    });
  }
};
