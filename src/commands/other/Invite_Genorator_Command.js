const commando = require('discord.js-commando');
const Discord = require('discord.js')
const { collapseTextChangeRangesAcrossMultipleVersions } = require('typescript')

module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'gen-invite',
            aliases: ['invite-maker', 'gen-inv'],
            group: 'other',
            memberName: 'invite-command-maker',
            description: '..',
            userPermissions: [
                'SEND_MESSAGES'
            ],
            clientPermissions: [
                'CREATE_INSTANT_INVITE',
                'SEND_MESSAGES'
            ],
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 1,
                duration: 120,
            },
        })
    }
    async run ( message, args ) {
        let time;
        let timeInfo;
        if (args[0] == 'permanent' || args[0] == 'perm') {
            if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You must have the Administrator permission to make a permanent invite link!')
            time = 0
            timeInfo = 'is permanent!'
        } else {
            time = 86400
            timeInfo = 'will expire in 1 day!'
        }

        message.channel.createInvite({
                unique: true,
                maxAge: time
            })
            .then(invite => {
                const Embed = new Discord.MessageEmbed()
                    .setTitle('Invite Link Generated')
                    .setDescription('Hi there!\nHere\'s your invite link: https://discord.gg/' + invite.code + "\nUse\`gen-inv perm\` to make it permanent! (Admin only!)")
                    .setFooter(`This link ${timeInfo} `)
                    .setTimestamp()
                    .setColor('#c28ada')
                message.channel.send(Embed)
            })
            .catch(console.error)
    }
}