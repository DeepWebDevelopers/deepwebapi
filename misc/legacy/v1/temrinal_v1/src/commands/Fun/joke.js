const bruh = require("bruhapi")

module.exports = {
    name: "joke",
    minArgs: 0,
    maxArgs: 0,
    description: "Get a random joke",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(await bruh(`/joke`))
    }
}