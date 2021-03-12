const bruh = require("bruhapi")

module.exports = {
    name: "word",
    minArgs: 0,
    maxArgs: 0,
    description: "Get a random word",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(await bruh(`/word`))
    }
}