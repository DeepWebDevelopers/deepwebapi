const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'spank',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Ow my ass",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        const target = message.mentions.users.first() ? message.author : client.user
        const pfp = target.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        const target2 = message.mentions.users.first() ? message.mentions.users.first() : message.author
        const pfp2 = target2.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        canvacord.spank(pfp, pfp2).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("spank.png")

            message.channel.send(att)
        })
    }
}