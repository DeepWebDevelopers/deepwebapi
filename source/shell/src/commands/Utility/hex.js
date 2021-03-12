module.exports = {
    name: "hex",
    minArgs: 2,
    maxArgs: -1,
    expectedArgs: "<either encode or decode> <value>",
    description: "Convert hex to text or the other way around",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        if (!args[0]) return message.channel.send("Please specify a valid codec, either decode or encode.")

        let choices = ["encode", "decode"]
        if (!choices.includes(args[0].toLowerCase())) return message.channel.send("Unknown parameter. Please choose the method first, either decode or encode it.");

        let textIn = args.slice(1).join(" ");
        if (!textIn) return message.channel.send("Please input some text, preferably in ASCII encoding. See https://theasciicode.com.ar/ for a list of available characters to choose from.");
        if (textIn.length > 1024) return message.channel.send("Maximum input is 1024 characters, sorry!");

        function encode(textOu) {
            let arr1 = [];
            for (var n = 0, l = textOu.length; n < l; n++) {
                var hex = Number(textOu.charCodeAt(n)).toString(16)
                arr1.push(hex)
            }

            return arr1.join('');
        }

        function decode(textOu) {
            var hex = textOu.toString()
            var str = ""

            for (var n = 0; n < hex.length; n += 2) {
                str += String.fromCharCode(parseInt(hex.substr(n, 2), 16))
            }
            return str
        }

        if (args[0].toLowerCase() === "encode") {
            return message.channel.send(encode(textIn));
        } else if (args[0].toLowerCase() === "decode") {
            return message.channel.send(decode(textIn));
        }
    }
}