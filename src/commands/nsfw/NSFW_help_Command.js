const commando = require('discord.js-commando');
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'nsfw',
            aliases: ['porn'],
            nsfw: true,
            group: 'nsfw',
            memberName: 'nsfw-cmd',
            description: 'Sends the user dirty things ;)',
            clientPermissions: [
                'SEND_MESSAGES'
            ],
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 4,
                duration: 10,
            },
        })
    }
    async run ( message, args ) {
        message.channel.send('A list of all nsfw commands. (comming soon!)')
    }
}