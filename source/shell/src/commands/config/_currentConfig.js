const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const logChannel = require("../../db/guild/logging");
const muterole = require("../../db/guild/muterole");

module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "botconfig",
      aliases: ["bot-settings", "server-settings", "config"],
      group: "config",
      userPermissions: ["SEND_MESSAGES", "MANAGE_MESSAGES", "MANAGE_ROLES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "bot_config_settings_command",
      description: "Shows the current settings for the bot in the server.",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
      throttling: {
        usages: 2,
        duration: 12,
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
    //! COMMAND NEEDS FIXED!!! ERROR PULLING DATA FROM MONGO.

    const prefix = message.guild.commandPrefix;

    await logChannel.findOne(
      {
        guildID: message.guild.id,
      },

      async (err) => {
        if (err) console.error(err);

        var logs_channel_id = logChannel.logChannelID;

        if (!logs_channel_id) var logs_channel_id = "No channel set";

        const embed = new Discord.MessageEmbed()
          .setAuthor(
            "Terminal config settings",
            message.client.user.avatarURL()
          )
          .setTimestamp()
          .setDescription(
            `Here is a list of all the current settings for Terminal in your server. If you wish to change the data run the \`${prefix}reset\` command`
          )
          .addField(
            "test",
            `The Current Mod logs channel for your server is <#${logs_channel_id}>`
          )
          .addField("test", `testing`);

        message.channel.send(embed);
      }
    );
  }
};
