const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'jail',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Go to jail.",
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

        canvacord.jail(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("jail.png")

            message.channel.send(att)
        })
    }
}