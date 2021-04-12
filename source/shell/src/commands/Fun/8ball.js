const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "8ball",
      aliases: ["eightball"],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "eight_ball_command",
      description: "Play with 8ball",
      argsType: "single",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 15,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    if (!args[0]) return message.reply("You need to ask a question stupid!");

    //The default messages it can produce
    const messages = [
      "As I see it, yes.",
      "Ask again later.",
      "Better not tell you now.",
      "Cannot predict now.",
      "Concentrate and ask again.",
      "Don’t count on it.",
      "It is certain.",
      "It is decidedly so.",
      "Most likely.",
      "My reply is no.",
      "My sources say no.",
      "Outlook not so good.",
      "Outlook good.",
      "Reply hazy, try again.",
      "Signs point to yes.",
      "Very doubtful.",
      "Without a doubt.",
      "Yes.",
      "Yes – definitely.",
      "You may rely on it.",
    ];

    //This will be the message that the bot will send back to the user
    let finalmessage;

    //It gets a random position from the array
    let randomizer = Math.floor(Math.random() * messages.length);

    //Assigns the value to the array's specified position
    finalmessage = messages[randomizer];

    //Sends the message
    message.channel.send(finalmessage);
  }
};
