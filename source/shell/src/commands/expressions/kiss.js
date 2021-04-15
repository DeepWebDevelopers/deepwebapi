const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "kiss",
      //   aliases: [""],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "kiss_user_command",
      description: "Kiss someone!",
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
    const prefix = message.guild.commandPrefix;

    const NEKO = require("nekos.life");

    const neko = new NEKO();

    const user = message.mentions.users.first();
    if (!user) return message.reply("Mention someone to kiss");

    if (user === message.author)
      return message.reply("Trying to kiss yourself?");

    if (user === message.client.user)
      return message.reply("i dont want your kiss 🔨");

    let owo = await neko.sfw.kiss();

    const kissembed = new Discord.MessageEmbed()
      .setTitle(user.username + " You have been kissed! ")
      .setDescription(
        user.toString() + " got kissed by " + message.author.toString()
      )
      .setImage(owo.url)
      .setColor(`RANDOM`)
      .setFooter("Thank you for using Terminal!")
      .setURL(owo.url);
    message.channel.send(kissembed);
  }
};
