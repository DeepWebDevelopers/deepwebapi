const cheerio = require("cheerio");
const request = require("request");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
  constructor(client) {
    super(client, {
      name: "image",
      aliases: ["images", "img"],
      group: "fun",
      userPermissions: ["SEND_MESSAGES"],
      clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
      memberName: "image_fun_command",
      description: "Search and get any random image",
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

    if (!args[0]) return message.reply("Give me an image to seach!");

    //Combine the command arguments together
    let imagesearch = args.slice(0).join(" ");

    //make a function
    function image(message) {
      var options = {
        //search dogpile with the given query
        url: "http://results.dogpile.com/serp?qc=images&q=" + imagesearch,
        method: "GET",
        headers: {
          Accept: "text/html",
          "User-Agent": "Chrome",
        },
      };

      request(options, function (error, response, responseBody) {
        if (error) return;

        let $ = cheerio.load(responseBody);

        //make a array with the image urls
        var links = $(".image a.link");
        var urls = new Array(links.length)
          .fill(0)
          .map((v, i) => links.eq(i).attr("href"));

        //check if no image found
        if (!urls.length) return;

        //Make it pretty
        let embed = new Discord.MessageEmbed()
          .setColor("#2F3136")
          .setTitle(`Showing random image for: "${imagesearch}"`)
          .setTimestamp()
          .setImage(urls[Math.floor(Math.random() * urls.length)])
          .setFooter("Thank you for using Terminal!")
          .setAuthor(message.author.tag, message.author.avatarURL());

        //send it back
        message.channel.send(embed);
      });
    }

    //call the function
    image(message);
  }
};
