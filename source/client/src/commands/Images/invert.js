const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'invert',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Invert profile picture.",
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

        canvacord.invert(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("inverted.png")

            message.channel.send(att)
        })
    }
}