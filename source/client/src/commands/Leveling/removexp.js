const discordXP = require('discord-xp')
const Discord = require("discord.js")
module.exports = {
    name: 'removexp',
    aliases: ["-xp"],
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: "[mention] <amount>",
    description: "Remove xp from someone's xp profile",
    category: "Leveling",
    requiredPermissions: ['ADMINISTRATOR'],
    run: async ({ message, args, text, client, prefix, instance }) => {
        let target = message.mentions.members.first()

        if (target) {
            let amountToremove = parseInt(args[1])
            if (isNaN(amountToremove)) return message.channel.send("Specify a **number** please.")

            discordXP.subtractXp(target.id, message.guild.id, amountToremove)
            setTimeout(async () => {
                let XPuser = await discordXP.fetch(target.id, message.guild.id)

                if (!XPuser) return message.channel.send(`Seems like ${target} has less XP than the amount you are subtracting, or they have no XP.`)

                message.channel.send(`${message.author} has taken **${amountToremove}** XP away from ${target}, they now have **${XPuser.xp}** XP.`)
            }, 1000)
        } else if (!target) {
            let amountToremove = parseInt(args[0])
            if (isNaN(amountToremove)) return message.channel.send("Specify a **number** please.")

            discordXP.subtractXp(message.author.id, message.guild.id, amountToremove)
            setTimeout(async () => {
                let XPuser = await discordXP.fetch(message.author.id, message.guild.id)

                message.reply(`I have taken **${amountToremove}** XP from you, you now have **${XPuser.xp}** XP.`)
            }, 1000)
        }
    }
}