const commando = require('discord.js-commando');
const Discord = require('discord.js');
module.exports = class howgayCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'howgay',
            group: 'fun',
            memberName: 'howgay',
            description: 'A simple command to find out who is gay using math...',
            guildOnly: true,
            throttling: {
                usages: 5,
                duration: 30,
            },
        })
    }
    async run ( message, args ) {
        const mentionedMember = message.mentions.users.first()
        if (!mentionedMember) return message.channel.send('You need to mention before checking')
        const gayr8 = Math.floor(Math.random() * 100) + 0;
        const embed = new Discord.MessageEmbed()
           .setTitle(`Gayr8 Machine`)
           .setDescription(`:rainbow_flag: ${mentionedMember} is ${gayr8}% gay`)
           .setFooter(`Totally real gay rate checker`)
           .setColor(`RANDOM`)
           message.channel.send(embed)
    }
}