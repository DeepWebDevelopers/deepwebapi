const warnSchema = require("../../db/warn");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "warn",
      // aliases: ["w"],
      group: "moderation",
      userPermissions: ["SEND_MESSAGES", "KICK_MEMBERS", "MANAGE_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "warn_command",
      description: "Wanr a user and send it to logs",
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

    let member = message.mentions.members.first();
    let memberId = member.id;
    let memberTag = `${member.user.username}#${member.user.discriminator}`;

    if (memberId === message.client.user.id)
      return message.reply("You cannot warn me.");
    if (memberId === message.author.id)
      return message.reply("You cannot warn yourself.");

    let staff = message.member;
    let staffId = staff.id;
    let staffTag = `${staff.user.username}#${staff.user.discriminator}`;

    let reason = args.slice(1).join(" ");

    if (!reason) reason = "No reason provided.";
    if (staff.roles.highest.position < member.roles.highest.position)
      return message.reply(
        `You cannot warn ${memberTag} due to role hierarchy.`
      );

    try {
      let data = await warnSchema.findOne({
        warnId: memberId,
        guildId: message.guild.id,
      });

      if (!data) {
        let newData = await warnSchema.create({
          warnId: memberId,
          warnTag: memberTag,
          guildId: message.guild.id,
          guildName: message.guild.name,
          warnings: [Object],
          lastUpdated: Date.now(),
        });

        data = newData;
      }

      let warning = {
        warnDate: Date.now(),
        staffId: staffId,
        staffTag: staffTag,
        reason: reason,
        warnId: memberId,
      };

      let newWarn = await warnSchema.findOneAndUpdate(
        {
          warnId: memberId,
          guildId: message.guild.id,
        },
        {
          warnId: memberId,
          guildId: message.guild.id,
          lastUpdated: Date.now(),
          $push: {
            warnings: warning,
          },
        },
        {
          upsert: true,
        }
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
            return message.reply(
              `There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
            );
          }
        }
      );
      const modlog = message.guild.channels.cache.get(guildDB.logChannelID);

      const DMEmbed = new Discord.MessageEmbed()
        .setColor("PINK")
        .setTitle(`You have been warned in ${data.guildName}`)
        .setAuthor(
          "Automated Terminal message",
          message.client.user.avatarURL()
        )
        .setTimestamp()
        .setFooter("Shoulda followed the rules... :/")
        .addFields(
          {
            name: "Moderator",
            value: staffTag,
          },
          {
            name: "Reason",
            value: reason,
          },
          {
            name: "Date",
            value: newWarn.lastUpdated.toLocaleString(),
          }
        );

      member
        .createDM()
        .then((DM) => {
          DM.send(DMEmbed).then(() => {
            const success = new Discord.MessageEmbed()
              .setColor("PINK")
              .setDescription(
                `Successfully warned **${newWarn.warnTag}** for **${warning.reason}**  \n\nAction logged in <#${modlog.id}>`
              )
              .setFooter("Thank you for using Terminal!")
              .setTimestamp();
            message.channel.send(success).catch((err) => {
              return;
            });

            const modlogEmbed = new Discord.MessageEmbed()
              .setColor("YELLOW")
              .setTitle("Member warned")
              .setAuthor("Terminal Modlog", message.client.user.avatarURL())
              .setTimestamp()
              .setFooter("Thank you for using Terminal!")
              .addFields(
                {
                  name: "Warned member",
                  value: `${memberTag} (${memberId})`,
                },
                {
                  name: "Responsible moderator",
                  value: `${staffTag} (${staffId})`,
                },
                {
                  name: "Reason",
                  value: `${reason}`,
                },
                {
                  name: "Date",
                  value: `${newWarn.lastUpdated.toLocaleString()}`,
                }
              );
            modlog.send(modlogEmbed).catch((e) => {
              return;
            });
          });
        })
        .catch((e) => {
          return; // Catching err if user has their dms off.
        });
    } catch (err) {
      console.log(err);
      message.channel.send(`An error occurred: \`${err.message}\``);
    }
  }
};

// const mongo = require("../../mongo");
// await mongo().then(async (mongoose) => {
// 	try {
// 		//? logging
// 		const Logs = require("../../db/guild/logging");
// 		var d = new Date(Date.now());
// 		const guildDB = await Logs.findOne(
// 			{
// 				guildID: message.guild.id,
// 			},
// 			async (err, guild) => {
// 				if (err) console.error(err);

// 				if (!guild) {
// 					return message.reply(
// 						`There is no modlog system setup for Terminal. Please set one up for my command functions. Run: **${prefix}setlogs**`
// 					);
// 				}
// 			}
// 		);
// 		const modlog = message.guild.channels.cache.get(guildDB.logChannelID);
// 		//embed

// 		modlog.send(modlogEmbed).catch((e) => {
// 			return;
// 		});
// 	} catch (err) {
// 		console.log(err);
// 		message.channel.send(`An error occurred: \`${err.message}\``);
// 	}
// });
