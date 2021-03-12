const ms = require("ms")
module.exports = {
    name: 'endgiveaway',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<giveaway message ID>",
    description: 'End a giveaway',
    category: "Giveaways",
    requiredPermissions: ['MENTION_EVERYONE'],
    run: async ({ message, args, text, client, prefix, instance }) => {
        const ended = await client.giveaways.endGiveaway(args[0])

        if (!ended) return message.channel.send("That giveaway has already ended or is not a giveaway.")
        else message.channel.send("Successfully ended the giveaway!")
    }
}