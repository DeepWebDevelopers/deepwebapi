const Discord = require("discord.js")
const generatePassword = require("password-generator")
module.exports = {
    name: 'code',
    minArgs: 0,
    maxArgs: 0,
    description: "Generate a code",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send("__**I will generate a code with the following properties:**__\n> Between 16 and 32 characters\n> A minimum of 4 uppercase letters\n> A minimum of 6 lowercase letters\n> A minimum of 4 numbers\n> A minimum of 2 special characters from the following: `? -`\n\nDo you agree to the conditions? **YES** or **NO**")

        const filter = msg => msg.author.id === message.author.id;
        const options = {
            max: 1
        }

        let collector = await message.channel.awaitMessages(filter, options);
        let answer = collector.first().content;

        if (answer === "no" || answer === "NO" || answer === "No" || answer === "cancel" || answer === "Cancel") {
            return message.channel.send(`Code generaton process ended, requested by ${message.author.tag}.`)
        }

        if (answer === "yes" || answer === "YES" || answer === "Yes") {
            var maxLength = 32;
            var minLength = 16;
            var uppercaseMinCount = 4;
            var lowercaseMinCount = 6;
            var numberMinCount = 4;
            var specialMinCount = 2;
            var UPPERCASE_RE = /([A-Z])/g;
            var LOWERCASE_RE = /([a-z])/g;
            var NUMBER_RE = /([\d])/g;
            var SPECIAL_CHAR_RE = /([\?\-])/g;
            var NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

            function isStrongEnough(password) {
                var uc = password.match(UPPERCASE_RE);
                var lc = password.match(LOWERCASE_RE);
                var n = password.match(NUMBER_RE);
                var sc = password.match(SPECIAL_CHAR_RE);
                var nr = password.match(NON_REPEATING_CHAR_RE);
                return password.length >= minLength &&
                    !nr &&
                    uc && uc.length >= uppercaseMinCount &&
                    lc && lc.length >= lowercaseMinCount &&
                    n && n.length >= numberMinCount &&
                    sc && sc.length >= specialMinCount;
            }

            function customPassword() {
                var password = "";
                var randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
                while (!isStrongEnough(password)) {
                    password = generatePassword(randomLength, false, /[\w\d\?\-]/);
                }
                return password;
            }
            message.reply(`|| ${customPassword()} ||`)
        }
    }
}