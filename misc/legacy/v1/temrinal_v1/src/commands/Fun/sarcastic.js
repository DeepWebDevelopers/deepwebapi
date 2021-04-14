const sarc = require("sarcastic-text")

module.exports = {
    name: "sarcastic",
    aliases: [ "sarc "],
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "BrO yOu ArE sO fUnNy",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        //Simple as this, what to I describe here?
        let sarcasticText = sarc.getSarcastic(text)
        message.channel.send(sarcasticText)
    }
}