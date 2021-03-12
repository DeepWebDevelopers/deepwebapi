const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'changemymind',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "Change my mind",
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

        canvacord.changemymind(text).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("changemymind.png")

            message.channel.send(att)
        })
    }
}