const commando = require('discord.js-commando');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js')
const superagent = require('superagent')

module.exports = class TickleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'tickle',
            group: 'fun',
            memberName: 'tickles',
            description: 'Tickle a user',
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 3,
                duration: 10,
            },
        })
    }
    async run ( message, args ) {
        const { body } = await superagent
        .get("https://nekos.life/api/v2/img/tickle");
        if(message.mentions.users.size < 1) return message.channel.send(`How can you kiss tickle nobody?💔`)
            let user = message.guild.member(message.mentions.users.first());
        const embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`${message.mentions.users.first().username}, you got tickled by ${message.author.username}`)
        .setImage(body.url) 
        message.channel.send({embed})
    }
}