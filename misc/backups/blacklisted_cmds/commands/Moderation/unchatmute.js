const muteSchema = require("../../db/chatmute");
const Logs = require("../../db/guild/logging");
const muterole = require("../../db/guild/muterole");
var d = new Date(Date.now());
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "unchatmute",
      aliases: ["unmute", "uncmute"],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES", "MUTE_MEMBERS", "MANAGE_ROLES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_ROLES"],
      memberName: "unmnute_command",
      description: "Remove the mute role from a member.",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 35,
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

    if (!message.guild.me.hasPermission("MANAGE_ROLES"))
      return message.channel.send(
        "**I Dont Have The Permissions To remove roles! - [MANAGE_ROLES]**"
      );

    if (!args[0])
      return message
        .reply("I cant unmute the air...")
        .then((m) => m.delete({ timeout: 5902 }));
    let member = message.mentions.members.first();
    if (!member) return message.reply("I cant find that user to unmute.");

    var memberId = member.id;
    let memberTag = `${member.user.username}#${member.user.discriminator}`;

    if (memberId === message.client.user.id)
      return message.reply("Did you really just try to unmute me...using me?");
    if (memberId === message.author.id)
      return message.reply("You cannot unmute yourself.");
    if (member.user.bot)
      return message.reply("Target is a bot, failed to unmute.");

    let staff = message.member;
    let staffId = staff.id;
    let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

    let reason = args.slice(1).join(" ");

    if (!reason) reason = "No reason provided.";
    if (staff.roles.highest.position < member.roles.highest.position)
      return message.reply(
        `You cannot unmute ${memberTag} due to role hierarchy.`
      );

    try {
      let data = await muteSchema.findOneAndDelete({
        muteId: memberId,
        guildId: message.guild.id,
      });

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

      muterole.findOne({ guildID: message.guild.id }, async (err, data432) => {
        if (err) console.error(err);
        if (!data432) {
          return message.reply(
            "No mute role found in this guild. Please run `setmute` to use this command."
          );
        }
        try {
          let rrole = message.guild.roles.cache.get(data432.roleID);
          if (!rrole)
            return message.reply(
              "You dont have a mute role set in this server!"
            );

          const success = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setDescription(
              `Successfully unmuted **${data.muteTag}** from chatting for **${reason}** \n\nAction logged in <#${modlog.id}>`
            )
            .setFooter("Thank you for using Terminal!")
            .setTimestamp();
          message.channel.send(success);
          const modlogEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setTitle("Member UnMuted")
            .setAuthor("Terminal Modlog", message.client.user.avatarURL())
            .setTimestamp()
            .setFooter("Thank you for using Terminal!")
            .addFields(
              {
                name: "Unmuted member",
                value: `${memberTag} (${memberId})`,
              },
              {
                name: "Responsible moderator",
                value: `${staffTag} (${staffId})`,
              },
              {
                name: "Reason for unmute",
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
          member.roles.remove(rrole).catch((err) => {
            return message.repy(
              "There was an error adding the role to the member."
            );
          });
        } catch (err) {
          console.log(err);
          return;
        }
      });
    } catch (err) {
      console.log(err);
      message.channel.send(`An error occurred: \`${err.message}\``);
    }
  }
};

/** //! Mute system without log channel db (working)
 * let modlog = message.guild.channels.cache.find((channel) => {
			return channel.name && channel.name.includes("t-modlog");
		});
		let role = message.guild.roles.cache.find((role) => {
			return role.name === "muted";
		});

		let target = message.mentions.members.first();
		let targetId = target.id;
		let targetTag = `${target.user.username}#${target.user.discriminator}`;

		if (targetId === client.user.id)
			return message.reply("You cannot mute me using me.");
		if (targetId === message.author.id)
			return message.reply("You cannot mute yourself.");
		if (target.user.bot)
			return message.reply("Target is a bot, failed to unmute.");

		let staff = message.member;
		let staffId = staff.id;
		let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

		let reason = args.slice(1).join(" ");

		if (!modlog)
			message.channel.send(
				`Could not find channel **t-modlog**, please install the required values using \`${prefix}setup\` as it is HIGHLY recommended.`
			);
		if (!role)
			return message.channel.send(
				`Could not find role **muted**, please install the required values using \`${prefix}setup\`.`
			);
		if (!target.roles.cache.has(role.id))
			return message.channel.send(
				`Target ${targetTag} already does not have role **muted** assigned.`
			);
		if (!reason) reason = "No reason provided.";
		if (staff.roles.highest.position < target.roles.highest.position)
			return message.reply(
				`You cannot unmute ${targetTag} due to role hierarchy.`
			);

		await mongo().then(async (mongoose) => {
			try {
				let data = await muteSchema.findOneAndDelete({
					muteId: targetId,
					guildId: message.guild.id,
				});

				target.roles.remove(role);

				const success = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setDescription(
						`Successfully unmuted **${data.muteTag}** from chatting for **${reason}**`
					)
					.setFooter("Thank you for using Terminal!")
					.setTimestamp();
				message.channel.send(success);
				const modlogEmbed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle("Member UnMuted")
					.setAuthor("Terminal Modlog", message.client.user.avatarURL())
					.setTimestamp()
					.setFooter("Thank you for using Terminal!")
					.addFields(
						{
							name: "Unmuted member",
							value: `${targetTag} (${targetId})`,
						},
						{
							name: "Responsible moderator",
							value: `${staffTag} (${staffId})`,
						},
						{
							name: "Reason for unmute",
							value: `${reason}`,
						},
						{
							name: "Date",
							value: `${Date.now().toLocaleString()}`,
						}
					);
				modlog.send(modlogEmbed).catch((e) => {
					return;
				});
			} catch (err) {
				console.log(err);
				message.channel.send(`An error occurred: \`${err.message}\``);
			}
		});
 */
