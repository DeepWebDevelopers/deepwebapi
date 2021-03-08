const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'kiss',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<mention>",
    description: "❤",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        const target1 = message.author
        const pfp = target1.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        const target2 = message.mentions.users.first()
        const pfp2 = target2.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        canvacord.kiss(pfp, pfp2).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("kiss.png")

            message.channel.send(att)
        })
    }
}