const commando = require('discord.js-commando');
const client = require('nekos.life');
const Discord = require('discord.js')
const neko = new client();

module.exports = class owoifyCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'owoify',
            aliases: ['owo'],
            group: 'fun',
            memberName: 'owoify',
            description: 'owoifys a text',
            argsType: 'multiple',
            guildOnly: true, 
            throttling: {
                usages: 3,
                duration: 25,
            },
        })
    }
    async run ( message, args ) {
        async function work() {

            let coolusertext = args.join(" ");
              if (!coolusertext) return message.channel.send('❌ Please type some text to owoify.')
              if (coolusertext.length > 200) return message.channel.send(`I can't owoify your text, it is over 200 characters long!`)
            
                    let owo = await neko.sfw.OwOify({text: coolusertext});
                    message.channel.send(owo.owo).catch(error => {
                        console.error(error);
                    });
                  }
                 work();
          }
}