const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "smug",
      //   aliases: [""],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "smug_user_command",
      description: "smug someone!",
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
    if (!user) return message.reply("Mention someone to smug");

    if (user === message.author)
      return message.reply("Trying to smug yourself?");

    if (user === message.client.user)
      return message.reply("i dont want your smugs 🔨");

    let owo = await neko.sfw.smug();

    const smugembed = new Discord.MessageEmbed()
      .setTitle(user.username + " You have been smugged! ")
      .setDescription(
        user.toString() + " got smugged by " + message.author.toString()
      )
      .setImage(owo.url)
      .setColor(`RANDOM`)
      .setFooter("Thank you for using Terminal!")
      .setURL(owo.url);
    message.channel.send(smugembed);
  }
};
