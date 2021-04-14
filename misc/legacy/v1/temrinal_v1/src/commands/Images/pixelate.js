const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'pixelate',
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: "[mention] <amount of pixels>",
    description: "Pixelate a profile picture.",
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

        const amount = parseInt(args[message.mentions.users.first() ? 1 : 0])
        if (isNaN(amount)) return message.channel.send("The amount of pixels has to be a numeric value.")

        canvacord.pixelate(pfp, amount).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("pixelated.png")

            message.channel.send(att)
        })
    }
}