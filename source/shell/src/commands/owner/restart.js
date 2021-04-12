const shell = require("shelljs");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "restart",
      // aliases: [""],
      group: "owner",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "restart_bot_command",
      description: "restarts node processes",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
      throttling: {
        usages: 3,
        duration: 25,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;

    message.channel.send("The bot is restarting in 3 seconds...").then(() => {
      setTimeout(() => {
        client.destroy();
        shell.exec("yarn demon");
      }, 3000);
    });
  }
};
