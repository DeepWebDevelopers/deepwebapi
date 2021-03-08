const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'youtube',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "Youtube comment",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        const options = {
            username: message.member.displayName,
            content: text,
            avatar: message.author.displayAvatarURL({
                dynamic: false,
                format: "png"
            })
        }
        canvacord.youtube(options).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("comment.png")

            message.channel.send(att)
        })
    }
}