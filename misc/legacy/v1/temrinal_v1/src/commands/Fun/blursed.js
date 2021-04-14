const Discord = require("discord.js")
const got = require("got")
module.exports = {
    name: 'blursed',
    minArgs: 0,
    maxArgs: 0,
    description: 'Random image from r/blursedimages',
    category: 'Fun & Games',
    run: async ({ message, args, text, client, prefix, instance }) => {
        const embed = new Discord.MessageEmbed()
        got("https://www.reddit.com/r/blursedimages/random/.json").then(response => {
            //Fetch most of the data from the reddit post it recieves
            let content = JSON.parse(response.body)
            let permalink = content[0].data.children[0].data.permalink
            let memeUrl = `https://reddit.com${permalink}`
            let memeImage = content[0].data.children[0].data.url
            let memeTitle = content[0].data.children[0].data.title
            let memeUpvotes = content[0].data.children[0].data.ups
            let memeDownvotes = content[0].data.children[0].data.downs
            let memeNumComments = content[0].data.children[0].data.num_comments
    
            //Put it all in an embed so it looks organized and pretty
            embed.setTitle(`${memeTitle}`)
            embed.setURL(`${memeUrl}`)
            embed.setImage(memeImage)
            embed.setColor("RANDOM")
            embed.setFooter(`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`)
            embed.setTimestamp()

            //Send it back
            message.channel.send(embed)
        })
    }
}