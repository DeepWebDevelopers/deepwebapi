const bruh = require("bruhapi")

module.exports = {
    name: "fact",
    minArgs: 0,
    maxArgs: 0,
    description: "Get a random fact",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(await bruh(`/fact`))
    }
}