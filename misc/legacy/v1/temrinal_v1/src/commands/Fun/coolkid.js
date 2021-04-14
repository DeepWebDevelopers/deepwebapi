const Discord = require("discord.js")
module.exports = {
    name: 'coolkid',
    aliases: [ 'cool' ],
    minArgs: 0,
    maxArgs: 0,
    description: "Welcome to downtown coolsville",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        //Get a random number from the range of 100
        let precent = Math.floor(Math.random() * 101)

        //Send it back
        message.reply(`You are ${precent}% cool kid. 😎`)
    }
}