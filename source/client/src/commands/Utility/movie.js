const Discord = require("discord.js")
const axios = require("axios").default
module.exports = {
    name: 'movie',
    minArgs: 1,
    maxArgs: -1,
    expectedArgs: "<movie search query>",
    description: "Search for a movie",
    category: "Utility",
    run: async ({ message, args, text, client, prefix, instance }) => {
        var options = {
            method: 'GET',
            url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${text}`,
            headers: {
                'x-rapidapi-key': process.env.RAPID_API,
                'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com'
            }
        };

        axios.request(options).then(results => {
            var options2 = {
                method: 'GET',
                url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${results.data.titles[0].id}`,
                headers: {
                    'x-rapidapi-key': process.env.RAPID_API,
                    'x-rapidapi-host': 'imdb-internet-movie-database-unofficial.p.rapidapi.com'
                }
            };

            axios.request(options2).then(result => {
                let cast = []

                for (let i = 0; i < result.data.cast.length; i++) {
                    cast.push(result.data.cast[i].actor)
                }

                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(result.data.title)
                    .setTimestamp()
                    .setDescription(`**Year:** ${result.data.year}\n**Length:** ${result.data.length}\n**Rating:** ${result.data.rating ? result.data.rating : "`unknown`"} out of 10 (${result.data.rating_votes ? result.data.rating_votes : "`unknown`"} votes)`)
                    .setImage(result.data.poster)
                    .addFields(
                        { 
                            name: "Plot",
                            value: result.data.plot
                        },
                        {
                            name: "Cast",
                            value: cast.join(", ")
                        },
                        {
                            name: "Technical Specifications",
                            value: `**Sound Mix:** ${result.data.technical_specs[1][1]}\n**Color:** ${result.data.technical_specs[2][1]}\n**Aspect Ratio:** ${result.data.technical_specs[3][1]}`
                        }
                    )

                return message.channel.send(embed)
            }).catch(err => {
                console.log(err)
                return message.channel.send("An error occurred: " + err.message)
            })
        }).catch(err => {
            console.log(err)
            return message.channel.send("An error occurred: " + err.message)
        })
    }
}