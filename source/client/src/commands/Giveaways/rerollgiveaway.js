const ms = require("ms")
module.exports = {
    name: 'rerollgiveaway',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<giveaway message ID>",
    description: 'Reroll a giveaway',
    category: "Giveaways",
    requiredPermissions: ['MENTION_EVERYONE'],
    run: async ({ message, args, text, client, prefix, instance }) => {
        const ended = await client.giveaways.rerollGiveaway(args[0])

        if (!ended) return message.channel.send("That giveaway has not ended or is not a giveaway.")
        else message.channel.send("Successfully rerolled the giveaway!")
    }
}