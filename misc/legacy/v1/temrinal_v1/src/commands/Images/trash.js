const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'trash',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "GARBAGE",
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

        canvacord.trash(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("trash.png")

            message.channel.send(att)
        })
    }
}