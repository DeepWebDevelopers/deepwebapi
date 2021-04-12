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
    //! COMMAND NEEDS FIXED!!! ERROR PULLING DATA FROM MONGO.

    const prefix = message.guild.commandPrefix;

    await logChannel.findOne(
      {
        guildID: message.guild.id,
      },
      async (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          const newGuild = new Guild({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            logChannelID: Loggingchannel.id,
            logChannelName: Loggingchannel.name,
          });

          await newGuild
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.error(err));
        }
        const logs_channel_id = message.logChannelID;

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
