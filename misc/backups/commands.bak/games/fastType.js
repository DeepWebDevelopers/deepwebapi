const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "fasttype",
      //   aliases: [""],
      group: "games",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "fasttype_game_command",
      description: "play fast type with others in the server!",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: false,
      throttling: {
        usages: 1,
        duration: 35,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    const { FastType } = require("weky"); // System to control game
    const txtgen = require("txtgen"); // system to generate random words
    // txtgen.sentence(), txtgen.paragraph() txtgen.article()
    const game = new FastType({
      message: message,
      winMessage: `GG! ${message.author.username} Won 🏆`, //message sent when user types perfectly
      sentence: txtgen.sentence(), //sentence-to-be-typed
      loseMessage: `Sorry ${message.author.tag} you lost!`, //message sent when user misspell it
      time: 15000, //time that user has in ms
      startMessage: "Good Luck!", //message sent when user starts playing
    });
    game.start();
  }
};
