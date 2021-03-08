const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'affect',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "This does not affect my baby.",
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

        canvacord.affect(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("affect.png")

            message.channel.send(att)
        })
    }
}