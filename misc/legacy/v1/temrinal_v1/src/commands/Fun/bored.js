const Discord = require("discord.js")
const axios = require("axios").default
module.exports = {
    name: 'bored',
    minArgs: 0,
    maxArgs: 0,
    description: 'Ya bored? Same.',
    category: 'Fun & Games',
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        axios.get("http://www.boredapi.com/api/activity/").then(async res => {
            const activity = res.data.activity
            const type = res.data.type
            const participants = res.data.participants
            const price = res.data.price * 10
            const key = res.data.key
            const accessibility = res.data.accessibility * 10

            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Are you bored?")
                .setDescription(`**Activity:** ${activity}\n**Type:** ${type}\n**Participants:** ${participants}\n**Price:** ${price} out of 10\n**Accessibility:** ${accessibility} out of 10`)
                .setTimestamp()
                .setFooter(key)
            message.channel.send(embed)
        })
    }
}