const Discord = require("discord.js")
module.exports = {
    name: 'gamer',
    minArgs: 0,
    maxArgs: 0,
    description: "Welcome to downtown gamersville",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        //Get a random number between 1 and 100, as it is the precentage
        let precent = Math.floor(Math.random() * 101)

        //Send it back
        message.reply(`You are ${precent}% gamer. 🎮`)
    }
}