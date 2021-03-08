const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'triggered',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "AAAAAAAAAAAAAAaaa",
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

        canvacord.trigger(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("triggered.gif")

            message.channel.send(att)
        })
    }
}