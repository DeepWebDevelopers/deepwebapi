const axios = require("axios").default;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "insult",
      aliases: ["roast"],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "insult_fun_command",
      description: "Feeling down? Then insult yourself...yay!",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 75,
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

    let options = {
      method: "GET",
      url: "https://api.snowflakedev.xyz/api/roast",
      headers: {
        Authorization: config.snowflake_api_key,
      },
    };

    axios
      .request(options)
      .then(async (res) => {
        let embed = new Discord.MessageEmbed()
          .setColor("RED")
          .setDescription(`${res.data.roast}`)
          .setTimestamp()
          .setFooter(`Thanks for using Terminal! Enjoy the roast!`);

        await message.reply(embed);
      })
      .catch(async (err) => {
        console.log(err);
        await message.channel.send(`An error occurred: ${err.message}`);
      });
  }
};
