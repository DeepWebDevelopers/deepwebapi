const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'burn',
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: "[mention] <intensity>",
    description: "Burn a profile picture.",
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
        if (isNaN(amount)) return message.channel.send("The intensity has to be a numeric value.")

        canvacord.burn(pfp, amount).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("burned.png")

            message.channel.send(att)
        })
    }
}