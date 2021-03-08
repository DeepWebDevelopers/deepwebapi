const owo = require("owoify-js").default

module.exports = {
    name: "uvu",
    minArgs: 1,
    maxArgs: -1,
    description: "Uvuify everything",
    category: "Fun & Games",
    expectedArgs: "<text>",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(owo(text, "uvu"))
    }
}