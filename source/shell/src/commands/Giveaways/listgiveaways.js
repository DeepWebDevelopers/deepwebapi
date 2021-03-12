const prettyMilliseconds = require('pretty-ms')
module.exports = {
    name: 'listgiveaways',
    minArgs: 0,
    maxArgs: 0,
    description: 'End a giveaway',
    category: "Giveaways",
    run: async ({ message, args, text, client, prefix, instance }) => {
        const list = await client.giveaways.listGiveaways(message.guild.id)

        if (!list) return message.channel.send("There are no active giveaways in this server at the moment.")
        else message.channel.send(`${list.map(i => `\`${i.messageId}\` - **${i.prize}** | ${prettyMilliseconds(i.timeRemaining)} | Host: **${i.hostedBy}**`).join('\n')}`)
    }
}