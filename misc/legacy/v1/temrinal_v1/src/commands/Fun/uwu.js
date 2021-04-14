const owo = require("owoify-js").default

module.exports = {
    name: "uwu",
    minArgs: 1,
    maxArgs: -1,
    description: "Uwuify everything",
    category: "Fun & Games",
    expectedArgs: "<text>",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(owo(text, "uwu"))
    }
}