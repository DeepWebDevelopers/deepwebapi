const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'hitler',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "Worse than Hitler!",
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

        canvacord.hitler(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("hitler.png")

            message.channel.send(att)
        })
    }
}