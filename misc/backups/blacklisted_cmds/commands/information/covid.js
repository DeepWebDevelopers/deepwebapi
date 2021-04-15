const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "covid",
      aliases: ["c-19", "19stats"],
      group: "information",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "covid_19_command",
      description: "Sends info on global covid 19 pandemic.",
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

    const covid = require("novelcovid");

    const covidStats = await covid.all();

    return message
      .reply(
        new Discord.MessageEmbed()
          .setTitle("😷 COVID-19 STATISTICS")
          .setColor("BLUE")
          .setFooter(`😷𝗖𝗢𝗩𝗜𝗗-𝟭𝟵 Stay at home`)
          .addFields(
            {
              name: `🦠 Cases`,
              value: covidStats.cases.toLocaleString(),
              inline: true,
            },
            {
              name: `🦠 Cases Today`,
              value: covidStats.todayCases.toLocaleString(),
              inline: true,
            },
            {
              name: `🦠 Deaths`,
              value: covidStats.deaths.toLocaleString(),
              inline: true,
            },
            {
              name: `🦠 Deaths Today`,
              value: covidStats.todayDeaths.toLocaleString(),
              inline: true,
            },
            {
              name: `🦠 Recovered`,
              value: covidStats.recovered.toLocaleString(),
              inline: true,
            },
            {
              name: `🦠 Recovered Today`,
              value: covidStats.todayRecovered.toLocaleString(),
              inline: true,
            },
            {
              name: `🦠 Active Cases`,
              value: covidStats.active.toLocaleString(),
              inline: true,
            },
            {
              name: `🦠 In Critical Condition`,
              value: covidStats.critical.toLocaleString(),
              inline: true,
            },
            {
              name: `🦠 Tested`,
              value: covidStats.tests.toLocaleString(),
              inline: true,
            }
          )
      )
      .catch((e) => {
        console.log(e);
        return message.channel.send("Err fetching data, please retry!");
      });
  }
};
