const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'wanted',
    minArgs: 0,
    maxArgs: 1,
    expectedArgs: "[mention]",
    description: "the police are after you!",
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

        canvacord.wanted(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("wanted.png")

            message.channel.send(att)
        })
    }
}