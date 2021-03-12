const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'bed',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "There's a monster under my bed!",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        let pfp1
        let pfp2
        
        let target = message.mentions.users.first()
        if (!target) {
            pfp1 = client.user.displayAvatarURL({
                dynamic: false,
                format: "png"
            })

            pfp2 = message.author.displayAvatarURL({
                dynamic: false,
                format: "png"
            })
        } else {
            pfp1 = message.author.displayAvatarURL({
                dynamic: false,
                format: "png"
            })

            pfp2 = target.displayAvatarURL({
                dynamic: false,
                format: "png"
            })
        }

        canvacord.bed(pfp1, pfp2).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("bed.png")

            message.channel.send(att)
        })
    }
}