const commando = require("discord.js-commando");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

module.exports = class TickleCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "tickle",
      group: "fun",
      memberName: "tickle_fun_command",
      description: "Tickle a user",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 3,
        duration: 35,
      },
    });
  }
  async run(message, args) {
    const { body } = await superagent.get(
      "https://nekos.life/api/v2/img/tickle"
    );
    if (message.mentions.users.size < 1)
      return message.channel.send(`How can you kiss tickle nobody?💔`);
    let user = message.guild.member(message.mentions.users.first());
    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor("Terminal Fun Commands", message.client.user.avatarURL())
      .setTitle(
        `${message.mentions.users.first().username}, you got tickled by ${
          message.author.username
        }`
      )
      .setImage(body.url);
    message.channel.send({ embed });
  }
};
