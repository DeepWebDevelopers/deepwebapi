const profileSchema = require("../../db/profile");
const ms = require("ms");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "hourly",
      // aliases: [""],
      group: "economy",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "hourly_eco_command",
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

      if (data.hourlyCooldown > Date.now()) {
        let timeLeft = Date.parse(data.hourlyCooldown) - Date.now();

        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        return message.reply(
          `You must wait **${minutes} minutes and ${seconds} seconds** before claiming your hourly coins again!`
        );
      } else {
        await profileSchema.findOneAndUpdate(
          {
            userId: userId,
          },
          {
            userId: userId,
            hourlyCooldown: Date.now() + ms("1h"),
          }
        );

        let currentWallet = data.wallet;

        let coinsEarned = Math.floor(Math.random() * 999 * data.multiplier);
        let roundedCoins = Math.floor(coinsEarned * 100) / 100;

        await profileSchema.findOneAndUpdate(
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
        `An error occurred: ${err.message}\nUsually this happens once, please try again.`
      );
    }
  }
};

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
