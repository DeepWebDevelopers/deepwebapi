const discordXP = require('discord-xp')
const Discord = require("discord.js")
module.exports = {
    name: 'removelevel',
    aliases: ["-lvl"],
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: "[mention] <amount>",
    description: "Remove levels from someone's xp profile",
    category: "Leveling",
    requiredPermissions: ['ADMINISTRATOR'],
    run: async ({ message, args, text, client, prefix, instance }) => {
        let target = message.mentions.members.first()

        if (target) {
            let amountToremove = parseInt(args[1])
            if (isNaN(amountToremove)) return message.channel.send("Specify a **number** please.")

            discordXP.subtractLevel(target.id, message.guild.id, amountToremove)
            setTimeout(async () => {
                let XPuser = await discordXP.fetch(target.id, message.guild.id)

                if (!XPuser) return message.channel.send(`Seems like ${target} has less amount of levels than the amount you are subtracting, or they have no level.`)

                message.channel.send(`${message.author} has taken **${amountToremove}** levels away from ${target}, they are now at level **${XPuser.level}**.`)
            }, 1000)
        } else if (!target) {
            let amountToremove = parseInt(args[0])
            if (isNaN(amountToremove)) return message.channel.send("Specify a **number** please.")

            discordXP.subtractLevel(message.author.id, message.guild.id, amountToremove)
            setTimeout(async () => {
                let XPuser = await discordXP.fetch(message.author.id, message.guild.id)

                message.reply(`I have taken **${amountToremove}** levels from you, you are now at level **${XPuser.level}**.`)
            }, 1000)
        }
    }
}