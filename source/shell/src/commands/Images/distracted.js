const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'distracted',
    minArgs: 2,
    maxArgs: 3,
    expectedArgs: "<mention> <mention> [mention]",
    description: "Ooh that girl hot.",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        const targets = message.mentions.users.array()

        const target1 = targets[0]
        const pfp1 = target1.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        const target2 = targets[1]
        const pfp2 = target2.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        canvacord.distracted(pfp1, pfp2, targets[2] ? targets[2].displayAvatarURL({
            dynamic: false,
            format: "png"
        }) : null).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("distracted.png")

            message.channel.send(att)
        })
    }
}