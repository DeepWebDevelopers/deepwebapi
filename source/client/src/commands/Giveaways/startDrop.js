module.exports = {
    name: 'startdrop',
    minArgs: 2,
    maxArgs: -1,
    expectedArgs: "<channel mention> <prize>",
    description: 'Start a drop',
    category: "Giveaways",
    requiredPermissions: ['MENTION_EVERYONE'],
    run: async ({ message, args, text, client, prefix, instance }) => {
        const channel = message.mentions.channels.first()
        const prize = args.slice(1).join(" ")

        const newDrop = await client.drops.createDrop({
            prize: prize,
            guildId: message.guild.id,
            channelId: channel.id,
            createdBy: message.author.id
        });

        message.channel.send(`Created a drop in ${channel}. The prize is **${newDrop.prize}**`)
    }
}