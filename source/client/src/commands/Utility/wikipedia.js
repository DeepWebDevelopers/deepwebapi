const Discord = require("discord.js")
const axios = require("axios").default
module.exports = {
    name: 'wikipedia',
    aliases: ["wiki"],
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<search>",
    description: "Wikipedia information",
    category: "Utility",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        let URL = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search="

        var options = {
            method: 'GET',
            url: URL + text,
        };

        axios.request(options).then(async res => {
            let names = []
            let urls = []
            let str = ""

            for (let i = 1; i < res.data[1].length; i++) {
                names.push(res.data[1][i])
            }

            for (let j = 1; j < res.data[3].length; j++) {
                urls.push(res.data[3][j])
            }

            for (let k = 0; k < names.length && k < urls.length; k++) {
                str += `[${names[k]}](${urls[k]})\n`
            }

            if (str.length > 2048) str = str.substr(0, 2048)

            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Showing search results for ${res.data[0]}`)
                .setDescription(str)
                .setFooter("Each link redirects you to its respectful Wikipedia page")
                .setTimestamp()
                .setURL(res.data[3][0])

            message.channel.send(embed)
        })
    }
}