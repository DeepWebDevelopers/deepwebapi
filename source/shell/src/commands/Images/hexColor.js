const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'hexcolor',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<hex value>",
    description: "Convert hex to color.",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        if (text.includes("#")) {
            let data = canvacord.color(text, true, 500, 1000)
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("hexcolor.png")

            message.channel.send("**Background:** hex color\n**Text color:** inverted hex color", att)
        } else return message.channel.send("Please include the `#` before the hex value.")

    }
}