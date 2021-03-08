const Discord = require("discord.js")
module.exports = {
    name: 'beep',
    minArgs: 0,
    maxArgs: 0,
    description: 'Imitate a robot :)',
    category: 'Fun & Games',
    run: async ({ message, args, text, client, prefix, instance }) => {
        //🤖
        message.channel.send('Boop 🤖')
    }
}