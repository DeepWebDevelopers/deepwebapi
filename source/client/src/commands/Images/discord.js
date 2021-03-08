const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'discord',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "Fake Discord message",
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
        canvacord.quote(options).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("quote.png")

            message.channel.send(att)
        })
    }
}