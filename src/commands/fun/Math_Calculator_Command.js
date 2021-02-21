const commando = require('discord.js-commando');
module.exports = class Command extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'math',
            aliases: ['cal'],
            group: 'fun',
            memberName: 'math',
            description: 'Does a simple math calculation for you :).',
            argsType: 'multiple',
            guildOnly: true,
            throttling: {
                usages: 5,
                duration: 7,
            },
        })
        
    }
    async run ( message, args ) {
        let method = args[0]
        let firstNumber = Number(args[1])
        let secondNumber = Number(args[2])
        const operations = ['add', 'sub', 'mul', 'div']

        if (!method) return message.reply('Please state an operation. ex: ``math add <#>``, ``math sub <#>``, ``math mul <#>``, ``math div <#>``')

        if (!operations.includes(method)) return message.reply('When chosing an operation please select ``add``, ``sub``(subscract), ``mul``(multiply) or ``div``(divide).')

        if (!args[1]) return message.reply('You can only use 2 operations at a time. Usage: ``;cal add 5 5`` This will add 5 + 5. Doing `5+5` will not work.')

        if (!args[2]) return message.reply('You can only use 2 operations at a time. Usage: ``;cal add 5 5`` This will add 5 + 5. Doing `5+5` will not work.')

        if (isNaN(firstNumber)) return message.reply('The first number you stated was not a number.')

        if (isNaN(secondNumber)) return message.reply('The second number you stated is not a number.')

        if (method === 'add') {
            let doMath = firstNumber + secondNumber
            message.channel.send(`${firstNumber} + ${secondNumber} = ${doMath}`)
        }
        if (method === 'sub') {
            let doMath = firstNumber - secondNumber
            message.channel.send(`${firstNumber} - ${secondNumber} = ${doMath}`)
        }
        if (method === 'mul') {
            let doMath = firstNumber * secondNumber
            message.channel.send(`${firstNumber} * ${secondNumber} = ${doMath}`)
        }
        if (method === 'div') {
            let doMath = firstNumber / secondNumber
            message.channel.send(`${firstNumber} / ${secondNumber} = ${doMath}`)
        }
    }
}