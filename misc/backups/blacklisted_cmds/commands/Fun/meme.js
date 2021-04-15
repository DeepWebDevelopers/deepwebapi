const got = require("got");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class MemeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: "meme",
      aliases: ["memes"],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "meme_fun_command",
      description: "Send a random meme from r/memes",
      argsType: "multiple",
      guildOnly: true,
      throttling: {
        usages: 4,
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

    const embed = new Discord.MessageEmbed();
    try {
      got("https://www.reddit.com/r/memes/random/.json").then((response) => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;
        embed.addField(`${memeTitle}`, `[View thread](${memeUrl})`);
        embed.setImage(memeImage);
        embed.setColor("RANDOM");
        embed.setAuthor(
          "Terminal Fun Commands",
          message.client.user.avatarURL()
        );

        embed.setFooter(
          `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`
        );
        message.channel.send(embed);
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }
};
