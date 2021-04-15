const Discord = require("discord.js");
const got = require("got");
module.exports = {
  name: "wholesomememe",
  aliases: ["wm"],
  minArgs: 0,
  maxArgs: 0,
  description: "Random meme from r/wholesomememes",
  category: "Fun & Games",
  run: async ({ message, args, text, client, prefix, instance }) => {
    //See dankmeme.js it's literally the same thing
    const embed = new Discord.MessageEmbed();
    got("https://www.reddit.com/r/wholesomememes/random/.json").then(
      (response) => {
        let content = JSON.parse(response.body);
        let permalink = content[0].data.children[0].data.permalink;
        let memeUrl = `https://reddit.com${permalink}`;
        let memeImage = content[0].data.children[0].data.url;
        let memeTitle = content[0].data.children[0].data.title;
        let memeUpvotes = content[0].data.children[0].data.ups;
        let memeDownvotes = content[0].data.children[0].data.downs;
        let memeNumComments = content[0].data.children[0].data.num_comments;

        embed.setTitle(`${memeTitle}`);
        embed;
        embed
          .setURL(`${memeUrl}`)
          .setAuthor("Terminal Fun Commands", message.client.user.avatarURL());
        embed.setImage(memeImage);
        embed.setColor("RANDOM");
        embed.setFooter(
          `👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`
        );
        embed.setTimestamp();

        message.channel.send(embed);
      }
    );
  },
};
