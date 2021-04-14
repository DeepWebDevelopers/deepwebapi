const axios = require("axios").default
const Discord = require("discord.js")
module.exports = {
    name: "thesaurus",
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<word>",
    description: "Get a word's similar words",
    category: "Utility",
    run: async ({
        message,
        args,
        text,
        client,
        prefix,
        instance
    }) => {
        let word = args[0]

        axios.get(`https://dictionaryapi.com/api/v3/references/ithesaurus/json/${word}?key=${process.env.DICTIONARY2}`).then(async (data, err) => {
            let alldata = data.data

            if (!alldata[0].meta) {
                message.channel.send("Word not found.")
                return false
            }

            let otherWords = []

            for (let i = 0; i < alldata.length; i++) {
                otherWords.push(alldata[i].meta.id + ` (${alldata[i].fl})`)
            }

            let syns = []

            if (alldata[0].meta.syns.length > 0) {
                for (let i = 0; i < alldata[0].meta.syns.length; i++) {
                    for (let j = 0; j < alldata[0].meta.syns[i].length; j++) {
                        syns.push(alldata[0].meta.syns[i][j])
                    }
                }
            } else syns = ["none"]

            let ants = []

            if (alldata[0].meta.ants.length > 0) {
                for (let k = 0; i < alldata[0].meta.ants.length; k++) {
                    for (let l = 0; l < alldata[0].meta.ants[k].length; l++) {
                        syns.push(alldata[0].meta.ants[k][k])
                    }
                }
            } else ants = ["none"]

            let embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Results for ${alldata[0].meta.id}`)
                .addFields({
                    name: "Synonyms",
                    value: `${syns.join(", ")}`
                }, {
                    name: "Antonyms",
                    value: `${ants.join(", ")}`
                }, {
                    name: `Other results`,
                    value: otherWords.join(", ")
                })
                .setTimestamp()

            message.channel.send(embed)
        })
    }
}