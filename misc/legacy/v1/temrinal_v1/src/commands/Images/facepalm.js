const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'facepalm',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "🤦🏼‍♂️",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        const target = message.mentions.users.first() || message.author
        const pfp = target.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        canvacord.facepalm(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("facepalm.png")

            message.channel.send(att)
        })
    }
}