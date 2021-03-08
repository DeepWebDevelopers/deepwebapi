const owo = require("owoify-js").default

module.exports = {
    name: "owo",
    minArgs: 1,
    maxArgs: -1,
    description: "Owoify everything",
    category: "Fun & Games",
    expectedArgs: "<text>",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(owo(text))
    }
}