const reverse = require("reverse-text")
module.exports = {
    name: 'backwards',
    aliases: [ "reverse" ],
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "olleh",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(reverse(text))
    }
}