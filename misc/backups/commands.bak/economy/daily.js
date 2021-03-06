const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const profileSchema = require("../../db/profile");
const ms = require("ms");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "daily",
      // aliases: [""],
      group: "economy",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "daily_eco_command",
      description: "..",
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

    let target = message.author;
    let userId = target.id;

    try {
      let data = await profileSchema.findOne({
        userId: userId,
      });

      if (!data) {
        let newData = await profileSchema.create({
          userId: userId,
          job: "Unemployed",
          bank: 0,
          wallet: 0,
          multiplier: 1,
          inventory: [Object],
          dailyCooldown: Date.now(),
          workCooldown: Date.now(),
          weeklyCooldown: Date.now(),
          monthlyCooldown: Date.now(),
          hourlyCooldown: Date.now(),
          begCooldown: Date.now(),
          robCooldown: Date.now(),
          bankRobCooldown: Date.now(),
        });

        data = newData;
      }

      if (data.dailyCooldown > Date.now()) {
        let timeLeft = Date.parse(data.dailyCooldown) - Date.now();

        let hours = Math.floor(
          Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (100 * 60 * 60)) / 10
        );
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        return message.reply(
          `You must wait **${hours} hours, ${minutes} minutes, ${seconds} seconds** before claiming your daily coins again!`
        );
      } else {
        await profileSchema.findOneAndUpdate(
          {
            userId: userId,
          },
          {
            userId: userId,
            dailyCooldown: Date.now() + ms("1d"),
          }
        );

        let currentWallet = data.wallet;

        let coinsEarned = Math.floor(Math.random() * 1500 * data.multiplier);
        let roundedCoins = Math.floor(coinsEarned * 100) / 100;

        let afterDaily = await profileSchema.findOneAndUpdate(
          { userId: userId },
          {
            userId: userId,
            wallet: currentWallet + roundedCoins,
          },
          {
            upsert: true,
          }
        );

        return message.reply(
          `$${formatNumber(roundedCoins)} have been added to your wallet!`
        );
      }
    } catch (err) {
      console.error(err);
      message.channel.send(
        `An error occurred: ${e.message}\nUsually this happens once, please try again.`
      );
    }
  }
};

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
