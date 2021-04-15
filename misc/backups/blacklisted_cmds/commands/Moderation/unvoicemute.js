const muteSchema = require("../../db/voicemute");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const Guild = require("../../db/guild/logging");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "unvoicemute",
      aliases: ["uvcm", "unvmute"],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES", "MUTE_MEMBERS"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MUTE_MEMBERS"],
      memberName: "unvoice_mute_command",
      description: "Removes a voice mute from a member",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 45,
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
    const prefix = message.guild.commandPrefix;

    if (!message.guild.me.hasPermission("MUTE_MEMBERS"))
      return message.channel.send(
        "**I Dont Have The Permissions To mute Users! - [MUTE_MEMBERS]**"
      );
    // let modlog = message.guild.channels.cache.find((channel) => {
    // 	return channel.name && channel.name.includes("t-modlog");
    // });
    if (!args[0]) return message.reply("Give me someone to unmute.");
    let member = message.mentions.members.first();
    if (!member) return message.reply("I can find that member to unmute.");
    let memberId = member.id;
    let memberTag = `${member.user.username}#${member.user.discriminator}`;

    if (!member)
      return message.channel.send("You need to mention a valid user.");
    if (memberId === message.client.user.id)
      return message.reply("You cannot unmute me using me.");
    if (memberId === message.author.id)
      return message.reply("You cannot unmute yourself.");

    if (!member.voice.channel)
      return message.reply(`${memberTag} is not connected to a voice channel.`);
    if (!member.voice.serverMute)
      return message.reply(`${memberTag} is already not server muted.`);
    if (member.user.bot)
      return message.reply("Target is a bot, failed to unmute.");

    let staff = message.member;
    let staffId = staff.id;
    let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

    let reason = args.slice(1).join(" ");

    if (!reason) reason = "No reason provided.";
    if (staff.roles.highest.position < member.roles.highest.position)
      return message.reply(
        `You cannot mute ${memberTag} due to role hierarchy.`
      );

    //? logging
    const Logs = require("../../db/guild/logging");
    var d = new Date(Date.now());
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

          return message.reply(
            `There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
          );
        }
      }
    );

    const modlog = message.guild.channels.cache.get(guildDB.logChannelID);
    if (!modlog) {
      return message
        .reply(
          `Sorry I cant find your mod log channen in my db. Please create one using **${prefix}setlogs** then run this command again!`
        )
        .then((m) => {
          m.delete({ timeout: 5000 });
        });
    }

    const modlogEmbed = new Discord.MessageEmbed()
      .setColor("GRAY")
      .setTitle("Member Unvoice Muted")
      .setAuthor("Terminal Modlog", message.client.user.avatarURL())
      .setTimestamp()
      .setFooter("Thank you for using Terminal!")
      .addFields(
        {
          name: "Unmuted Voice member!",
          value: `${memberTag} (${memberId})`,
        },
        {
          name: "Responsible moderator",
          value: `${staffTag} (${staffId})`,
        },
        {
          name: "Reason for Unmute",
          value: `${reason}`,
        },
        {
          name: "Date",
          value: `${d.toString()}`,
        }
      );
    modlog.send(modlogEmbed).catch((e) => {
      return;
    });

    try {
      let data = await muteSchema.findOneAndDelete({
        muteId: memberId,
        guildId: message.guild.id,
      });

      member.voice.setMute(false, reason);

      const success = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setDescription(
          `Successfully un voice muted **${data.muteTag}** for **${reason}**  \n\nAction logged in <#${modlog.id}>`
        )
        .setFooter("Thank you for using Terminal!")
        .setTimestamp();
      message.channel.send(success);
    } catch (err) {
      console.log(err);
      message.channel.send(`An error occurred: \`${err.message}\``);
    }
  }
};
