const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'blur',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Blur a profile picture.",
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

        canvacord.blur(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("blur.png")

            message.channel.send(att)
        })
    }
}