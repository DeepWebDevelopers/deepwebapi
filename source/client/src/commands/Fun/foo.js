module.exports = {
    name: 'foo',
    minArgs: 0,
    maxArgs: 0,
    description: "foo() vs bar()",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        //foo?
        message.channel.send('Bar()')
    }
}