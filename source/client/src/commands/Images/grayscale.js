const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'grayscale',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Grayscale profile picture.",
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

        canvacord.greyscale(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("grayscale.png")

            message.channel.send(att)
        })
    }
}