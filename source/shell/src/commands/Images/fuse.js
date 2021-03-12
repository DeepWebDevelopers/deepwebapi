const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'fuse',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<mention>",
    description: "Fuse 2 profile pictures",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        const target = message.author
        const pfp = target.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        const target2 = message.mentions.users.first()
        const pfp2 = target2.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        canvacord.fuse(pfp, pfp2).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("fuse.png")

            message.channel.send(att)
        })
    }
}