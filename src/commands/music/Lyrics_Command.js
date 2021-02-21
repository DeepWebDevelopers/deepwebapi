const commando = require('discord.js-commando');
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'lyrics',
            aliases: ['song-info'],
            group: 'music',
            memberName: 'song-wfdq0wf9jq09fjq09f',
            description: '..',
            clientPermissions: [
                'CONNECT'
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
    if (!queue) return message.channel.send("There is nothing playing.").catch(console.error);
   
    let lyrics = null;

    try {
    const lyricsFinder = require("lyrics-finder");

      lyrics = await lyricsFinder(queue.songs[0].title, "");
      if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    } catch (error) {
      lyrics = `No lyrics found for ${queue.songs[0].title}.`;
    }

    const { MessageEmbed } = require("discord.js");
    
    let lyricsEmbed = new MessageEmbed()
      .setTitle(`${queue.songs[0].title} — Lyrics`)
      .setDescription(lyrics)
      .setColor("#c28ada")
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send(lyricsEmbed).catch(console.error); 
    }
}