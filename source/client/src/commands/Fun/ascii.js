const figlet = require("figlet")
module.exports = {
    name: 'ascii',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<text>",
    description: 'Convert text to fancy text',
    category: 'Fun & Games',
    run: async ({ message, args, text, client, prefix, instance }) => {
        //Combine all the arguments to a single string
        const arg = args.slice(0).join(" ")

        //Use the string to convert it to ascii, if there is an error, cancel, if the text is too large, cancel, if not, send
        figlet.text(arg, function (err, data) {
            if (err) return message.channel.send("Something went wrong")

            if (data.length > 2000) return message.channel.send("Too much text to output, for the love of god, don't type an entire essay.")

            //Ascii must be used with a monospaced font
            message.channel.send(`\`\`\`\n${data}\n\`\`\``)
        })
    }
}