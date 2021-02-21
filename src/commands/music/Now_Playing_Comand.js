const commando = require('discord.js-commando');
const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'now-playing',
            aliases: ['np'],
            group: 'music',
            memberName: 'music-cocxmmand-0sswd',
            description: '..',
            userPermissions: [
                'CONNECT',
                'VIEW_CHANNEL'
            ],
            clientPermissions: [
                'SPEAK',
                'CONNECT',
            ],
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 3,
                duration: 10,
            },
        })
    }
    async run ( message, args ) {
        const queue = message.client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    
        const song = queue.songs[0];
        const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
        const left = song.duration - seek;
    
        let nowPlaying = new MessageEmbed()
          .setTitle("Now playing")
          .setDescription(`${song.title}\n${song.url}`)
          .setColor("#c28ada")
          .setAuthor(message.client.user.username);
    
        if (song.duration > 0) {
          nowPlaying.addField(
            "\u200b",
            new Date(seek * 1000).toISOString().substr(11, 8) +
              "[" +
              createBar(song.duration == 0 ? seek : song.duration, seek, 20)[0] +
              "]" +
              (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)),
            false
          );
          nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));
        }
    
        return message.channel.send(nowPlaying);
    }
}