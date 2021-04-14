const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'ohno',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "Oh no! It's stupid!",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        canvacord.ohno(text).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("ohno.png")

            message.channel.send(att)
        })
    }
}