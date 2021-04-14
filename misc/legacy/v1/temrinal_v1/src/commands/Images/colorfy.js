const Discord = require("discord.js")
const canvacord = require("canvacord").Canvas
module.exports = {
    name: 'colorfy',
    minArgs: 1,
    maxArgs: 2,
    expectedArgs: "[mention] <hex value>",
    description: "Convert hex to color.",
    category: "Images",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        let color = message.mentions.users.first() ? args[1] : args[0]

        if (message.mentions.users.first() && args.length < 2) return message.channel.send("Please specify the hex color value.")

        if (color.includes("#")) {
            const target = message.mentions.users.first() || message.author
            const pfp = target.displayAvatarURL({
                dynamic: false,
                format: "png"
            })
    
            canvacord.colorfy(pfp, color).then(data => {
                let att = new Discord.MessageAttachment()
                    .setFile(data)
                    .setName("colorfy.png")
    
                message.channel.send(att)
            })
        } else return message.channel.send("Please include the `#` before the hex value.")
    }
}