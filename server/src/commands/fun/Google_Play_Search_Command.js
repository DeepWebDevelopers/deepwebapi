const commando = require('discord.js-commando');
const Discord = require('discord.js')
const PlayStore = require("google-play-scraper");
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'googleplay',
            aliases: ["pstore", "googleplaystore", "ps"],
            group: 'fun',
            memberName: 'googleplay',
            description: 'Search the play store',
            clientPermissions: [
                'SEND_MESSAGES'
            ],
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 3,
                duration: 45,
            },
        })
    }
    async run ( message, args ) {
        if (!args[0])
        return message.channel.send(
          `Please Give Something To Search - ${message.author.username}`
        );
  
      PlayStore.search({
        term: args.join(" "),
        num: 1
      }).then(Data => {
        let App;
  
        try {
          App = JSON.parse(JSON.stringify(Data[0]));
        } catch (error) {
          return message.channel.send(
            `No Application Found - ${message.author.username}!`
          );
        }
  
        let Embed = new Discord.MessageEmbed()
          .setColor('RANDOM')
          .setThumbnail(App.icon)
          .setURL(App.url)
          .setTitle(`${App.title}`)
          .setDescription(App.summary)
          .addField(`Price`, App.priceText, true)
          .addField(`Developer`, App.developer, true)
          .addField(`Score`, App.scoreText, true)
          .setFooter(`Requested By ${message.author.username}`)
          .setTimestamp();
  
        return message.channel.send(Embed);
      });
    }
}
