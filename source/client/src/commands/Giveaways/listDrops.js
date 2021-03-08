const {
    MessageEmbed
} = require('discord.js');
module.exports = {
    name: 'listdrops',
    minArgs: 0,
    maxArgs: 0,
    description: 'List all drops',
    category: "Giveaways",
    run: async ({ message, args, text, client, prefix, instance }) => {
        const list = await client.drops.listDrops(message.guild.id);

        if (!list) {
            return message.channel.send('There are no drops in this server at the moment.');
        }

        const mapped = list.map(i => `**${i.position}.** Channel: ${i.channel} | Prize: ${i.prize}`);

        const embed = new MessageEmbed()
            .setTitle('List of Drops')
            .setDescription(`${mapped.join('\n')}`)
            .setColor("RANDOM")
            .setFooter(client.user.tag, client.user.displayAvatarURL());

        message.channel.send(embed);
    }
}