const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'delete',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Are you sure you want to delete this file?",
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

        canvacord.delete(pfp, false).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("delete.png")

            message.channel.send(att)
        })
    }
}