const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js')
const superagent = require('superagent')

const commando = require('discord.js-commando');
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'cuddle',
            group: 'fun',
            memberName: 'cuddle',
            description: 'cuddle a user',
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 2,
                duration: 10,
            },
        })
    }
    async run ( message, args ) {
        const { body } = await superagent 
        .get("https://nekos.life/api/v2/img/cuddle")
        if(message.mentions.users.size < 1) return message.channel.send('Please Cuddle Someone...💔')
        let user = message.guild.member(message.mentions.users.first())
        const emb = new Discord.MessageEmbed()
        .setDescription(`${message.author.username} has given a warm cuddle to ${user}... What a nice person💙`)
        .setColor('RANDOM')
        .setTimestamp()
        .setImage(body.url)
        message.channel.send(emb)
        message.react('❤');
    }
}