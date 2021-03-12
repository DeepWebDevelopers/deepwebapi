const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'phub',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "<insert lenny face here>",
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
            message: text,
            image: message.author.displayAvatarURL({
                dynamic: false,
                format: "png"
            })
        }
        canvacord.phub(options).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("phub.png")

            message.channel.send(att)
        })
    }
}