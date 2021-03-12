const bruh = require("bruhapi")

module.exports = {
    name: "topic",
    minArgs: 0,
    maxArgs: 0,
    description: "Get a random topic to discuss",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(await bruh(`/topic`))
    }
}