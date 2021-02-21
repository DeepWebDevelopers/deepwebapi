const superagent = require("node-fetch");
const Discord = require('discord.js')
const rp = require('request-promise-native');

const commando = require('discord.js-commando');
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'ass',
            aliases: ['anal'],
            group: 'nsfw',
            memberName: 'ass-cmd',
            nsfw: true,
            description: '...',
            clientPermissions: [
                'SEND_MESSAGES'
            ],
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 5,
                duration: 20,
            },
        })
    }
    async run ( message, args ) {
        return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function(res)  {
            return rp.get({
                url:'http://media.obutts.ru/' + res[0].preview,
                encoding: null
            });
        }).then(function(res)   {
        
        const ass = new Discord.MessageEmbed()
              .setTitle("Ass")
              .setColor(`RANDOM`)
              .setImage("attachment://file.png").attachFiles([{ attachment: res, name: "file.png" }])
        
        
            message.channel.send(ass);
        });
    }
}