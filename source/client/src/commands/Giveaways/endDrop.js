module.exports = {
    name: 'enddrop',
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: "<drop position>",
    description: 'End a drop',
    category: "Giveaways",
    requiredPermissions: ['MENTION_EVERYONE'],
    run: async ({ message, args, text, client, prefix, instance }) => {
        if (isNaN(args[0])) return message.reply("Position is not a numerical value.")
        const deleted = await client.drops.deleteDrop(message.guild.id, parseInt(args[0]))
        if (!deleted) return message.channel.send("Drop does not exist.")
        message.channel.send(`Successfully deleted the drop`)
    }
}