const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'gradient',
    minArgs: 2,
    maxArgs: 2,
    expectedArgs: "<hex value 1> <hex value 2>",
    description: "Create hex gradient.",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        if (args[0].includes("#") && args[1].includes("#")) {
            let data = canvacord.gradient(args[0], args[1], 1000, 500)
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("gradient.png")

            message.channel.send(att)
        } else return message.channel.send("Please include the `#` before both hex values.")

    }
}