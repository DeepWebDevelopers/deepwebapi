const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'beautiful',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Oh this? This is beautiful!",
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

        canvacord.beautiful(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("beautiful.png")

            message.channel.send(att)
        })
    }
}