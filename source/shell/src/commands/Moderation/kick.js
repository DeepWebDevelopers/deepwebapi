const Discord = require("discord.js");
const commando = require("discord.js-commando");

const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "kick",
      // aliases: [""],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES", "KICK_MEMBERS"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "KICK_MEMBERS"],
      memberName: "kick_command",
      description: "Kicks a user from your server.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 35,
      },
    });
  }
  async run(message, args, client) {
    const prefix = message.guild.commandPrefix;
    if (!message.guild.me.hasPermission("KICK_MEMBERS"))
      return message.channel.send(
        "**I Dont Have The Permissions To Kick Users! - [KICK_MEMBERS]**"
      );

    if (!args[0])
      return message
        .reply("...so...your going to kick the air?")
        .then((m) => m.delete({ timeout: 5000 }));
    const member = message.mentions.members.first();
    const Logs = require("../../db/guild/logging");

    const guildDB = await Logs.findOne(
      {
        guildID: message.guild.id,
      },
      async (err, guild) => {
        if (err) console.error(err);

        if (!guild) {
          let mongoose = require("mongoose");
          const newLogData = new Logs({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            logChannelID: null,
            logChannelName: null,
          });

          await newLogData
            .save()
            .then((result) => console.log(result))
            .catch((err) => console.error(err));
        }
      }
    );

    const logChannel = message.guild.channels.cache.get(guildDB.logChannelID);
    if (!logChannel) {
      return message
        .reply(
          `Sorry I cant find your mod log channen in my db. Please create one using **${prefix}setlogs** then run this command again!`
        )
        .then((m) => {
          m.delete({ timeout: 5000 });
        });
    }

    const staff = message.member;
    const staffId = staff.id;
    const staffTag = `${staff.user.username}#${staff.user.discriminator}`;

    if (!member)
      return message.channel
        .send(
          "I cannot find the specified member. Please mention a member in this Discord server."
        )
        .then((m) => m.delete({ timeout: 6000 }));

    if (!member.kickable)
      return message.channel
        .send(
          "This member is not kickable. Make sure the admins give me a higher role than who you are trying to kick."
        )
        .then((m) => m.delete({ timeout: 8000 }));

    let reason = args.slice(1).join(" ");
    const date = new Date();
    date.setDate(date.getDate());

    if (!reason) reason = "No reason provided.";
    if (staff.roles.highest.position < member.roles.highest.position)
      return message.reply(
        `You cannot kick ${targetTag} due to role hierarchy.`
      );

    if (args.length > 1) reason = args.slice(1).join(" ");

    if (!logChannel) {
      return;
    } else {
      const embed = new Discord.MessageEmbed()
        .setColor(15158332)
        .setTitle("User Kicked")
        .setAuthor("Terminal Modlog", message.client.user.avatarURL())
        .addField("Username", member.user.username)
        .addField("User ID", member.id)
        .addField("Kicked by", `${(staffTag, staffId)}`)
        .addField("Reason", reason)
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");

      logChannel.send(embed);

      if (member.user.bot) {
        return;
      } else {
        member
          .send(
            `You were kicked from ${message.guild.name} \nReason: ${reason}.`
          )
          .catch((err) => {
            message.channel.send(`I ran into an err: ${err}`);
            console.log(err);
            return;
          });
        message.channel.send(
          `${member} was kicked! \n\nAction logged in <#${logChannel.id}>`
        );
      }
    }
  }
};
