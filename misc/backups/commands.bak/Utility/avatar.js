const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");

module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "avatar",
      aliases: ["pfp", "av"],
      group: "util",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "user_avatar_command",
      description: "Fetch a users profile avatar",
      argsType: "multiple",
      guildOnly: true,
      ownerOnly: true,
      throttling: {
        usages: 3,
        duration: 35,
      },
    });
  }
  async run(message, args, client) {
    // Get User from @ or ID
    try {
      const prefix = message.guild.commandPrefix;

      let target = message.mentions.members.first() || message.member;

      // message.channel.send(
      //   new Discord.MessageEmbed()
      //   .setTitle(`${target.user.tag}'s avatar`)
      //   .setImage(target.user.displayAvatarURL({dynamic: true, size: 512}))
      // )

      // ? WEB
      let webp256 = target.user.displayAvatarURL({
        format: "webp",
        size: 256,
      });
      let webp512 = target.user.displayAvatarURL({
        format: "webp",
        size: 512,
      });
      let webp1024 = target.user.displayAvatarURL({
        format: "webp",
        size: 1024,
      });
      let webp2048 = target.user.displayAvatarURL({
        format: "webp",
        size: 2048,
      });
      let webp4096 = target.user.displayAvatarURL({
        format: "webp",
        size: 4096,
      });

      // ? PNG
      let png256 = target.user.displayAvatarURL({
        format: "png",
        size: 256,
      });
      let png512 = target.user.displayAvatarURL({
        format: "png",
        size: 512,
      });
      let png1024 = target.user.displayAvatarURL({
        format: "png",
        size: 1024,
      });
      let png2048 = target.user.displayAvatarURL({
        format: "png",
        size: 2048,
      });
      let png4096 = target.user.displayAvatarURL({
        format: "png",
        size: 4096,
      });

      // JPEG

      let jpeg256 = target.user.displayAvatarURL({
        format: "jpeg",
        size: 256,
      });
      let jpeg512 = target.user.displayAvatarURL({
        format: "jpeg",
        size: 512,
      });
      let jpeg1024 = target.user.displayAvatarURL({
        format: "jpeg",
        size: 1024,
      });
      let jpeg2048 = target.user.displayAvatarURL({
        format: "jpeg",
        size: 2048,
      });
      let jpeg4096 = target.user.displayAvatarURL({
        format: "jpeg",
        size: 4096,
      });
      // ? GIF

      let gif256 = target.user.displayAvatarURL({
        format: "gif",
        dynamic: true,
        size: 256,
      });
      let gif512 = target.user.displayAvatarURL({
        format: "gif",
        dynamic: true,
        size: 512,
      });
      let gif1024 = target.user.displayAvatarURL({
        format: "gif",
        dynamic: true,
        size: 1024,
      });
      let gif2048 = target.user.displayAvatarURL({
        format: "gif",
        dynamic: true,
        size: 2048,
      });
      let gif4096 = target.user.displayAvatarURL({
        format: "gif",
        dynamic: true,
        size: 4096,
      });

      const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`Profile picture for ${target.user.tag}`)
        .setAuthor(target.user.tag, target.user.avatarURL())
        .setDescription("Choose your desired file format and size:")
        // .setThumbn ` ail(target.displayAvatarURL())
        .setImage(target.user.displayAvatarURL())
        .addFields(
          {
            name: "WebP:",
            value: `[256](${webp256}) | [512](${webp512}) | [1024](${webp1024}) | [2048](${webp2048}) | [4096](${webp4096})`,
          },
          {
            name: "PNG:",
            value: `[256](${png256}) | [512](${png512}) | [1024](${png1024}) | [2048](${png2048}) | [4096](${png4096})`,
          },
          {
            name: "Jpeg:",
            value: ` [256](${jpeg256}) | [512](${jpeg512}) | [1024](${jpeg1024}) | [2048](${jpeg2048}) | [4096](${jpeg4096})`,
          },

          {
            name: "GIF",
            value: `[256](${gif256}) | [512](${gif512}) | [1024](${gif1024}) | [2048](${gif2048}) | [4096](${gif4096})`,
          }
        )
        .setTimestamp()
        .setFooter("Thank you for using Terminal!");

      message.channel.send(embed);
    } catch (error) {
      console.log(error);
      return message.reply(
        `I have ran into an error fetching this users avatar. Try again.`
      );
    }
  }
};
