const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "slap",
      //   aliases: [""],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "slap_user_command",
      description: "slap someone!",
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

    const NEKO = require("nekos.life");

    const neko = new NEKO();

    const user = message.mentions.users.first();
    if (!user) return message.reply("Mention someone to slap");

    if (user === message.author)
      return message.reply("Trying to slap yourself?");

    if (user === message.client.user)
      return message.reply("i dont want your slap 🔨");

    let owo = await neko.sfw.slap();

    const slapembed = new Discord.MessageEmbed()
      .setTitle(user.username + " You have been slapped! ")
      .setDescription(
        user.toString() + " got slapped by " + message.author.toString()
      )
      .setImage(owo.url)
      .setColor(`RANDOM`)
      .setFooter("Thank you for using Terminal!")
      .setURL(owo.url);
    message.channel.send(slapembed);
  }
};
