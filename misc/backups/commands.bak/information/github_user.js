const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
const axios = require("axios");
const ErrorEmbed = require("../../util/error/ErrorEmbed");

module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "github",
      aliases: ["github-user", "git"],
      group: "information",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "ADD_REACTIONS"],
      memberName: "github_search_account_command",
      description: "Check someones Github profile out.",
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

    const username = args.join(" ");

    if (!username) {
      message.channel.send(
        `➤ Please make sure you have the following requirements: \n **🔰 Make sure that the user *exists* on Github!** \n**🔰 Input a user for me to search!**`
      );
    } else {
      axios.get(`https://api.github.com/users/${username}`).then((res) => {
        if (res.status === 404) {
          return message.channel.send(
            `➤ **${username}** does not exist on Github. Try again?`
          );
        }
        try {
          if (res.status === 200) {
            const date = new Date(Date.parse(res.data.created_at));
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();
            const GithubProfile = new Discord.MessageEmbed()
              .setColor("#2F3136")
              .setTimestamp()
              .setTitle("🕵️ Github Profile")
              .setAuthor(
                message.client.user.tag,
                message.client.user.displayAvatarURL()
              )
              .setThumbnail(res.data.avatar_url)
              .setFooter(
                `User: ${message.author?.tag} • Created by: ThatGuyJamal`,
                message.author.displayAvatarURL()
              )
              .setDescription(
                `Github Profile displayed for user **${username}**.`
              )
              .addFields(
                {
                  name: "⭐ Bio",
                  value: res.data.bio === null ? "No Bio!" : res.data.bio,
                },
                {
                  name: "⭐ Followers",
                  value: res.data.followers,
                  inline: true,
                },
                {
                  name: "⭐ Following",
                  value: res.data.following,
                  inline: true,
                },
                {
                  name: "⭐ Location",
                  value:
                    res.data.location === null
                      ? "No location!"
                      : res.data.location,
                  inline: true,
                },
                {
                  name: "⭐ Repos",
                  value: res.data.public_repos,
                  inline: true,
                },
                {
                  name: "⭐ Account created at:",
                  value: `${month}/${day}/${year}`,
                  inline: true,
                },
                {
                  name: `⭐ Link to Github profile`,
                  value: `[${username}'s Link](${res.data.html_url})`,
                  inline: true,
                }
              );
            return message.channel.send(GithubProfile).then(async (msg) => {
              await msg.react("❤️");
            });
          }
        } catch (err) {
          console.log(err);
          return message.reply(`Profile \`${username}\` does not exist.`);
        }
      });
    }
  }
};
