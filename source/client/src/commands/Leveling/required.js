const discordXP = require('discord-xp')
module.exports = {
    name: 'required',
    aliases: ["req"],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<level>",
    description: "Displays how much XP you need to reach a certain level",
    category: "Leveling",
    run: async ({ message, args, text, client, prefix, instance }) => {
        let level = parseInt(args[0])
        if (isNaN(level)) return message.channel.send("Specify a **number** please.")

        let requiredXP = discordXP.xpFor(level)

        message.channel.send(`The required XP to reach level ${level} is **${requiredXP}**.`)
    }
}