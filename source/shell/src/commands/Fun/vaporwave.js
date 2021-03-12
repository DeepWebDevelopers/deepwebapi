module.exports = {
    name: 'vaporwave',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: "H e l l o",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(text.split('').join(' '))
    }
}