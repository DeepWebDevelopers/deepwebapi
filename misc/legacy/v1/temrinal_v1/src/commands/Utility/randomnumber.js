const Discord = require("discord.js")
module.exports = {
    name: 'randomnumber',
    aliases: [ 'rn' ],
    minArgs: 0,
    maxArgs: 0,
    description: "Generate a random number",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        var whichone
        var minORmaxDeterminator = Math.floor(Math.random() * 2)
        console.log(minORmaxDeterminator)

        if (minORmaxDeterminator === 1) {
            whichone = Number.MAX_SAFE_INTEGER
        } else if (minORmaxDeterminator === 0) {
            whichone = Number.MIN_SAFE_INTEGER
        }

        var result = Math.floor(Math.random() * whichone)
        message.channel.send(`Your random number is \`${result}\``)
    }
}