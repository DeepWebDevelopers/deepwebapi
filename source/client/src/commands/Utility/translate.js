const Discord = require("discord.js")
const translate = require("@k3rn31p4nic/google-translate-api")
module.exports = {
    name: 'translate',
    minArgs: 3,
    maxArgs: -1,
    expectedArgs: "<from> <to> <query>",
    description: "Translate between languages",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        let textt = args.slice(2).join(" ")

        translate(textt, {
            from: args[0],
            to: args[1]
        }).then(res => {
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()
                .addField("Input", `\`\`\`${textt}\`\`\``)
                .addField("Output", `\`\`\`${res.text}\`\`\``)

            message.channel.send(embed)
        }).catch(err => {
            console.log(err)
            message.channel.send(`An error occurred: ${err.message}`)
        })
    }
}