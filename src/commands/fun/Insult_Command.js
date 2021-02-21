const fetch = require('node-fetch');
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class InsultCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'insult',
      group: 'fun',
      memberName: 'insult',
      description: 'Generate an evil insult!',
      throttling: {
        usages: 3,
        duration: 25,
      }
    });
  }

  run(message) {
    // thanks to https://evilinsult.com :)
    fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json')
      .then(res => res.json())
      .then(json => {
        const embed = new MessageEmbed()
          .setColor('#E41032')
          .setAuthor('Evil Insult', 'https://i.imgur.com/bOVpNAX.png', 'https://evilinsult.com')
          .setDescription(json.insult)
          .setTimestamp()
          .setFooter('Powered by evilinsult.com', '');
        return message.say(embed);
      })
      .catch(err => {
        message.say(':x: Failed to deliver insult!');
        return console.error(err);
      });
  }
};