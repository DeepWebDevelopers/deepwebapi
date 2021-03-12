module.exports = {
    name: "temporary",
    aliases: [ 'temp' ],
    minArgs: 2,
    maxArgs: -1,
    expectedArgs: "<time until delete (in MS)> <message>",
    description: "Send a message anonymously temporarily",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        if (!args[0]) return message.channel.send("You need to provide how many milliseconds to wait before deleting the message. For example, 1 second is equivalent to 1000 milliseconds.");
        let ms = parseInt(args[0]);
        if (isNaN(ms)) return message.channel.send("You must provile a valid number of milliseconds.");

        let str = args.slice(1).join(" ");
        if (!str.length) return message.channel.send("You must provide a message to send.");

        message.channel.send(str).then(msg => {
            msg.delete({
                timeout: ms
            })
        })

        setTimeout(async () => {
            message.delete()
        }, 500)
    }
}