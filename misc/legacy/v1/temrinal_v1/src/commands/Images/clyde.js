const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'clyde',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "The default Clyde bot",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        canvacord.clyde(text).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("clyde.png")

            message.channel.send(att)
        })
    }
}