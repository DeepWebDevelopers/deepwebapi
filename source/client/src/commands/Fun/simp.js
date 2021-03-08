const Discord = require("discord.js")
module.exports = {
    name: 'simp',
    minArgs: 0,
    maxArgs: 0,
    description: "Bro have you been watching pokimaine recently?",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        //Get a random precentage
        let precent = Math.floor(Math.random() * 101)

        //uh oh, have you been watching pokimaine lately?
        message.reply(`You are ${precent}% simp. 😳`)
    }
}