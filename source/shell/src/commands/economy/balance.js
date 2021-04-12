const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const profileSchema = require("../../db/profile");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "balance",
      aliases: ["bal"],
      group: "economy",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "ballence_command",
      description: "Sends the users balance.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 15,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    const target = message.mentions.users.first() || message.author;
    const userId = target.id;

    try {
      let data = await profileSchema.findOne({ userId: userId });

      if (!data) {
        let newData = await profileSchema.create({
          userId: target.id,
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

      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${target.tag}'s coin balance`)
        .setDescription(
          `\n**Wallet:** $${formatNumber(
            data.wallet
          )}\n**Bank:** $${formatNumber(data.bank)}`
        )
        .setThumbnail(
          target.displayAvatarURL({
            format: "png",
            dynamic: true,
          })
        )
        .setTimestamp();
      return message.channel.send(embed);
    } catch (e) {
      console.log(e);
      message.channel.send(
        `An error occurred: ${e.message}\nUsually this happens once, please try again.`
      );
    }
  }
};

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}
