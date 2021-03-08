const Discord = require("discord.js")
module.exports = {
    name: 'binary',
    minArgs: 2,
    maxArgs: -1,
    expectedArgs: "<either encode or decode> <value>",
    description: "Convert binary to text or the other way around",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        if (!args[0]) return message.channel.send("Unknown parameter. Please choose the method first, either decode or encode it.");

        let choice = ["encode", "decode"];
        if (!choice.includes(args[0].toLowerCase())) return message.channel.send("Unknown parameter. Please choose the method first, either decode or encode it.");

        let textIn = args.slice(1).join(" ");

        if (!textIn) return message.channel.send("Please input some text.");

        if (textIn.length > 1024) return message.channel.send("Maximum input is 1024 characters, sorry!");

        function encode(char) {
            return char.split("").map(str => {
                const converted = str.charCodeAt(0).toString(2);
                return converted.padStart(8, "0");
            }).join(" ")
        }

        function decode(char) {
            return char.split(" ").map(str => String.fromCharCode(Number.parseInt(str, 2))).join("");
        }

        if (args[0].toLowerCase() === "encode") {
            return message.channel.send(encode(textIn));
        } else if (args[0].toLowerCase() === "decode") {
            return message.channel.send(decode(textIn));
        }
    }
}