const commando = require('discord.js-commando');
const urban = require('urban');
const Discord = require('discord.js');
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'urban',
            group: 'fun',
            nsfw: true,
            memberName: 'urban',
            description: 'Tells an urban legend',
            argsType: 'single',
            guildOnly: true,
            throttling: {
                usages: 3,
                duration: 5,
            },
        })
        
    }
    async run ( message, args ) {
        urban.random().first(json => {
            const urboom = new Discord.MessageEmbed()
                .setTitle(json.word)
                .setDescription(json.definition)
                .addField('Upvotes', json.thumbs_up, true)
                .addField('Downvotes', json.thumbs_down, true)
                .setTimestamp(new Date())
                .setFooter(`Written by ${json.author}`);
    
            message.channel.send(urboom);
        });
    }
}