const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const profileSchema = require("../../db/profile");
const ms = require("ms");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "rob",
      aliases: ["steal"],
      group: "economy",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "rob_command",
      description: "Steal some money!",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 45,
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

    const target1 = message.author;
    const target2 = message.mentions.members.first();

    if (!target2) return message.channel.send("Give me someone to rub stupid!");

    const userId1 = target1.id;
    const userId2 = target2.id;
    try {
      let data1 = await profileSchema.findOne({
        userId: userId1,
      });
      let data2 = await profileSchema.findOne({
        userId: userId2,
      });

      if (!data1) {
        let newData1 = await profileSchema.create({
          userId: userId1,
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
        });

        data1 = newData1;
      }

      if (!data2) {
        let newData2 = await profileSchema.create({
          userId: userId2,
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

        data2 = newData2;
      }

      if (data1.robCooldown > Date.now()) {
        let timeLeft = Date.parse(data1.robCooldown) - Date.now();

        let hours = Math.floor(
          Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (100 * 60 * 60)) / 10
        );
        let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        return message.reply(
          `You must wait **${hours} hours, ${minutes} minutes, ${seconds} seconds** before robbing again!`
        );
      } else {
        await profileSchema.findOneAndUpdate(
          {
            userId: userId1,
          },
          {
            userId: userId1,
            robCooldown: Date.now() + ms("3h"),
          }
        );

        let currentWallet1 = data1.wallet;
        let currentWallet2 = data2.wallet;

        if (currentWallet2 < 1000)
          return message.reply(
            "It aint worth it bro, they have less than 1000 coins in their wallet."
          );

        let stolenAmount = Math.floor((Math.random() * currentWallet2) / 2);
        let roundedStolen = Math.floor(stolenAmount * 100) / 100;

        await profileSchema.findOneAndUpdate(
          {
            userId: userId1,
          },
          {
            userId: userId1,
            wallet: currentWallet1 + roundedStolen,
          },
          {
            upsert: true,
          }
        );

        await profileSchema.findOneAndUpdate(
          {
            userId: userId2,
          },
          {
            userId: userId2,
            wallet: currentWallet2 - roundedStolen,
          },
          {
            upsert: true,
          }
        );

        return message.channel.send(
          `**${target1}** has stolen ${formatNumber(roundedStolen)} from **${
            target2.displayName
          }**'s wallet!`
        );
      }
    } catch (err) {
      console.log(err);
      message.channel.send(
        `An error occurred: \`${err.message}\`\nUsually this happens once, please try again.`
      );
    }

    function formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    }
  }
};
