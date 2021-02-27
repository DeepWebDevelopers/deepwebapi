const superagent = require("node-fetch");
const Discord = require('discord.js')

const rp = require('request-promise-native');

const commando = require('discord.js-commando');
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'boobs',
            aliases: ['tits', 'boob'],
            group: 'nsfw',
            nsfw: true,
            memberName: 'boobs-cmd',
            description: '...',
            clientPermissions: [
                'SEND_MESSAGES'
            ],
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 4,
                duration: 15,
            },
        })
    }
    async run ( message, args ) {
        
  return rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function(res)  {
    return rp.get({
        url:'http://media.oboobs.ru/' + res[0].preview,
        encoding: null
    });
}).then(function(res)   {

const boobs = new Discord.MessageEmbed()
      .setTitle("Boobs")
      .setColor(`RANDOM`)
      .setImage("attachment://file.png").attachFiles([{ attachment: res, name: "file.png" }])


    message.channel.send(boobs);
});
    }
}