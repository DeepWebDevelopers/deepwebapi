const Discord = require("discord.js")
const urban = require("relevant-urban")
module.exports = {
    name: 'urban',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<search query (one word)>",
    description: "Urban dictionary",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        if (!args[0]) return message.channel.send("Please specify the query.")

        let result = await urban(text).catch(e => {
            return message.channel.send(`Unknown word phrase of **${text}**, please try again.`)
        })

        let definition = result.definition.replace(/\[/g, '').replace(/\]/g, '');
        let example = result.example.replace(/\[/g, '').replace(/\]/g, '');

        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(result.word)
            .setURL(result.urbanURL)
            .setDescription(`**Definition:**\n${definition}\n\n**Example:**\n${example}`)
            .addField("Author", result.author, true)
            .addField("Rating", `👍 ${result.thumbsUp.toLocaleString()} | 👎 ${result.thumbsDown.toLocaleString()}`)

        if (result.tags.length > 0 && result.tags.join(" ").length < 1024) {
            embed.addField("Tags", result.tags.join(", "), true);
        }

        return message.channel.send(embed)
    }
}