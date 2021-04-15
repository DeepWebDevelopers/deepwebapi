const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "fight",
      //   aliases: [""],
      group: "games",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "fight_game_command",
      description: "fight someone!",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: false,
      throttling: {
        usages: 2,
        duration: 45,
      },
      examples: ["fight <@user>"],
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

    const { fight } = require("weky");

    let target = message.mentions.users.first();

    if (!target) {
      return message.reply("Ping someone to fight!");
    }

    let bot = this.client;

    const fight_game = new fight({
      client: bot,
      message: message,
      acceptMessage:
        `${target.tag},` + message.author.tag + " wants to fight you!",
      challenger: message.author,
      opponent: message.mentions.users.first(),
    });
    fight_game.start();
  }
};
