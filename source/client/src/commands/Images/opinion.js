const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'opinion',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "Opinion, no way.",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        canvacord.opinion(message.author.displayAvatarURL({
            dynamic: false,
            format: "png"
        }), text).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("opinion.png")

            message.channel.send(att)
        })
    }
}