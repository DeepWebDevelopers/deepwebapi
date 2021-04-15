const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "slowmode",
      aliases: ["slowdown", "setslow"],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES", "MANAGE_CHANNELS"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_CHANNELS"],
      memberName: "slowdown_command",
      description: "Changes the channel slow mode in your server.",
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

    if (!message.guild.me.hasPermission("MANAGE_CHANNELS"))
      return message.channel.send(
        "**I Dont Have The Permissions To edit channels! - [MANAGE_CHANNELS]**"
      );
    const { channel } = message;

    if (args.length < 1) {
      message.reply("Please provide a duration.");
      return;
    }

    let duration = args.shift().toLowerCase();
    if (duration === "off") {
      duration = 0;
    }

    if (isNaN(duration)) {
      message.reply(
        'Please provide either a number of seconds or the word "off"'
      );
      return;
    }

    if (duration >= 21600) {
      return message.reply(
        "You have to set a duration lower than `21600`(6 hours.)"
      );
    }
    channel.setRateLimitPerUser(duration, args.join(" "));
    message.reply(
      `The slowmode for this channel has been set to **${duration}**`
    );
  }
};
