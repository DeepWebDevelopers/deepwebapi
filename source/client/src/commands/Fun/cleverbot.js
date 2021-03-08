const cleverbot = require("cleverbot-free")

module.exports = {
    name: "cleverbot",
    aliases: [ "clever"],
    minArgs: 1, 
    maxArgs: -1,
    expectedArgs: "<query>",
    description: "Smart chat bot with no context",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        //Combine all the arguments it receives
        const textIn = args.slice(0).join(" ")

        //Send it to cleverbot, recieve the response and send it back
        cleverbot(textIn).then(response => message.reply(response));
    }
}