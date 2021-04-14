module.exports = {
    name: 'poop',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "Hello 💩 world",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(text.replace(/\s/g, ' 💩 '))
    }
}