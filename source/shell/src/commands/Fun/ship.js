module.exports = {
    name: "ship",
    minArgs: 2, 
    maxArgs: 2,
    expectedArgs: "<first mention> <second mention>",
    description: "owo what's this",
    category: "Fun & Games",
    run: async ({ message, args, text, client, prefix, instance }) => {
        var mentionedUsers = message.mentions.members.array()
        var firstUser = mentionedUsers[0] || message.guild.members.cache.get(args[0]);
        var secondUser = mentionedUsers[1] || message.guild.members.cache.get(args[1]);

        if (!firstUser) return message.channel.send(`I could not find someone named **${args[0]}**!`)
        if (!secondUser) return message.channel.send(`I could not find someone named **${args[1]}**!`)

        if (firstUser === secondUser) return message.channel.send("You can't ship yourself lol")

        const firstName = firstUser.user.username
        const secondName = secondUser.user.username

        const firstSliced = firstName.slice(0, firstName.length / 2);
        const secondSliced = secondName.slice(0, secondName.length / 2)

        message.channel.send(`OwO what's this\n\n${firstName} + ${secondName} = **${firstSliced}${secondSliced}**`)
    }
}