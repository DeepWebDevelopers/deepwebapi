const flip = require("flip-text")
module.exports = {
    name: 'flip',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "Make text upside down.",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(flip(text))
    }
}