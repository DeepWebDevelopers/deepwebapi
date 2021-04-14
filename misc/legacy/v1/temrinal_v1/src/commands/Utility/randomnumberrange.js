const Discord = require("discord.js")
module.exports = {
    name: 'randomnumberrange',
    aliases: [ 'rnr' ],
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: "<minimum number> <maximum number>",
    description: "Generate a random number within the range",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        if (!args[0]) {
            message.reply("Please specify the minimum number.")
            return
        }
        if (!args[1]) {
            message.reply("Please specify the maximum number.")
            return
        }

        let min = parseInt(args[0])
        let max = parseInt(args[1])

        if (isNaN(min)) {
            message.reply("Please specify the minimum number as a **number**.")
            return
        }
        if (isNaN(max)) {
            message.reply("Please specify the maximum number as a **number**.")
            return
        }

        let result = Math.floor(Math.random() * (max - min) + min)
        message.channel.send(`From ${min} and ${max} you get \`${result}\``)
    }
}