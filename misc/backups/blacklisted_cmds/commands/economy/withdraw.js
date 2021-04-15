const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const profileSchema = require("../../db/profile");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "withdraw",
      aliases: ["with"],
      group: "economy",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "withdraw_command",
      description: "Withdraw bits from your bank",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 20,
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

      let currentWallet = data.wallet;
      let currentBank = data.bank;

      let toWith = parseInt(args[0]);

      if (isNaN(toWith))
        return message.channel.send("Please provide a numerical value.");

      if (toWith > data.bank)
        return message.reply("You don't have that many coins in your bank!");

      await profileSchema.findOneAndUpdate(
        {
          userId: userId,
        },
        {
          userId: userId,
          wallet: currentWallet + toWith,
          bank: currentBank - toWith,
        },
        {
          upsert: true,
        }
      );

      return message.reply(
        `Successfully withdrawn **${formatNumber(
          parseInt(args[0])
        )}** coins from the bank.`
      );
    } catch (err) {
      console.log(err);
      message.channel.send(
        `An error occurred: \`${err.message}\`\nUsually this happens once, please try again.`
      );
    }
  }
};

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
