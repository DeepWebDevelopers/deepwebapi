const discordXP = require('discord-xp')
const canvacord = require("canvacord")
const Discord = require("discord.js")
module.exports = {
    name: 'rank',
    aliases: ["level"],
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Display your/someone's xp profile",
    category: "Leveling",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        const target = message.mentions.users.first() || message.author
        let XPuser = await discordXP.fetch(target.id, message.guild.id)
        if (!XPuser) return message.channel.send(`Seems like ${target.tag} does not have any XP.`)
        let requiredXP = discordXP.xpFor(XPuser.level + 1)
        const rawLeaderboard = await discordXP.fetchLeaderboard(message.guild.id, message.guild.memberCount)

        const leaderboard = await discordXP.computeLeaderboard(message.client, rawLeaderboard).then(lb => {
            for (let i = 0; i < lb.length; i++) {
                if (lb[i].userID === target.id) {
                    return lb[i].position
                }
            }
        })

        const rankCard = new canvacord.Rank()
            .setAvatar(target.displayAvatarURL({
                dynamic: false,
                format: "png"
            }))
            .setCurrentXP(XPuser.xp)
            .setRequiredXP(requiredXP)
            .setStatus(target.presence.status, true)
            .setProgressBar("#FFBA49", "COLOR", rounded = true)
            .setUsername(target.username)
            .setDiscriminator(target.discriminator)
            .setLevel(XPuser.level)
            .setRank(leaderboard)
        rankCard.build().then(data => {
            const attachment = new Discord.MessageAttachment(data, "rankCard.png")
            message.channel.send(attachment)
        })
    }
}