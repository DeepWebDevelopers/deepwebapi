const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "rockpaperscissors",
      aliases: ["rps"],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "rock_paper_scissors_fun_command",
      description: "",
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

    //Notify the author that the game is running
    message.reply("Enter `r` for rock, `p` for paper, or `s` for scissors.");

    //Filter the response to only the command author
    const filter = (msg) => msg.author.id === message.author.id;
    const options = {
      max: 1,
    };

    //Initiate the collector
    let collector = await message.channel.awaitMessages(filter, options);
    let answer = collector.first().content;

    //Make the answer lowecase
    let answerLower = answer.toLowerCase();

    //Check for invalid syntax
    if (answerLower !== "r" && answerLower !== "p" && answerLower !== "s")
      return message.reply(
        "You entered an invalid option, `r` for rock, `p` for paper, or `s` for scissors."
      );

    //Randomize the AI's answer
    let AIanswers = ["r", "p", "s"];
    let randomizer = Math.floor(Math.random() * AIanswers.length);
    let response = AIanswers[randomizer];

    //Check for ties
    if (response === answerLower)
      return message.reply(
        `The game ended in a **TIE**! I responded with **${response}**, and you entered **${answerLower}**!`
      );

    //Check for AI win
    if (response === "r" && answerLower === "s")
      return message.reply(
        `I won! I responded with **${response}**, and you entered **${answerLower}**!`
      );
    if (response === "p" && answerLower === "r")
      return message.reply(
        `I won! I responded with **${response}**, and you entered **${answerLower}**!`
      );
    if (response === "s" && answerLower === "p")
      return message.reply(
        `I won! I responded with **${response}**, and you entered **${answerLower}**!`
      );

    //Check for AI loss
    if (answerLower === "r" && response === "s")
      return message.reply(
        `You won! I responded with **${response}**, and you entered **${answerLower}**!`
      );
    if (answerLower === "p" && response === "r")
      return message.reply(
        `You won! I responded with **${response}**, and you entered **${answerLower}**!`
      );
    if (answerLower === "s" && response === "p")
      return message.reply(
        `You won! I responded with **${response}**, and you entered **${answerLower}**!`
      );
  }
};
