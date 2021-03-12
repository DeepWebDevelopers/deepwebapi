const commando = require('discord.js-commando');
const Discord = require("discord.js");
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'pp',
            aliases: ['pp-size', 'bigp', 'pp?'],
            group: 'fun',
            memberName: 'pp-command',
            description: '',
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 3,
                duration: 10,
            },
        })
    }
    async run ( message, args ) {
        
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.user.username === args.slice(0).join(" ") || x.user.username === args[0]) || message.member
    const random = Math.round(Math.random() * 15);
    const ppLevel = "=".repeat(random)

    const embed = new Discord.MessageEmbed()
        .setTitle('PP Size Machine')
        .setDescription(`${member.user.username}'s Penis
        8${ppLevel}D`)
        .setTimestamp()
        .setFooter(`Command ran by ${message.author.username}`, message.author.displayAvatarURL() )
        .setColor('RANDOM')

    message.channel.send(embed);
    }
}
