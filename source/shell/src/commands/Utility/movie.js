const axios = require("axios").default
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "movie",
			aliases: ["show", "movie-search"],
			group: "util",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "movie_util_command",
			description: "Search for a movie",
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: true,
			throttling: {
				usages: 1,
				duration: 20,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

        let text = args.join(" ")
        if(!text) {
            return message.reply("You did not give me a movie to search.")
        }

        var options = {
					method: "GET",
					url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/${text}`,
					headers: {
						"x-rapidapi-key": config.RAPID_API_KEY,
						"x-rapidapi-host":
							"imdb-internet-movie-database-unofficial.p.rapidapi.com",
					},
				};

        axios.request(options).then(results => {
            var options2 = {
							method: "GET",
							url: `https://imdb-internet-movie-database-unofficial.p.rapidapi.com/film/${results.data.titles[0].id}`,
							headers: {
								"x-rapidapi-key": config.RAPID_API_KEY,
								"x-rapidapi-host":
									"imdb-internet-movie-database-unofficial.p.rapidapi.com",
							},
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