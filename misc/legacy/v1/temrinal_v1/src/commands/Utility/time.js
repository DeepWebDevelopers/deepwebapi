module.exports = {
    name: "time",
    minArgs: 0,
    maxArgs: 0,
    description: "Time. Just time.",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        message.channel.send(`**${new Date(Date.now())}**`)
    }
}