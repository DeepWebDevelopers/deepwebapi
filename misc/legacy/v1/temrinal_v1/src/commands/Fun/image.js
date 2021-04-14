const cheerio = require("cheerio");
const Discord = require("discord.js");
const request = require("request");
module.exports = {
	name: "image",
	aliases: ["i"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<query>",
	description: "Random image from a search",
	category: "Fun & Games",
	run: async ({ message, args, text, client, prefix, instance }) => {
		//Combine the command arguments together
		let imagesearch = args.slice(0).join(" ");

		//make a function
		function image(message) {
			var options = {
				//search dogpile with the given query
				url: "http://results.dogpile.com/serp?qc=images&q=" + imagesearch,
				method: "GET",
				headers: {
					Accept: "text/html",
					"User-Agent": "Chrome",
				},
			};

			request(options, function (error, response, responseBody) {
				if (error) return;

				$ = cheerio.load(responseBody);

				//make a array with the image urls
				var links = $(".image a.link");
				var urls = new Array(links.length)
					.fill(0)
					.map((v, i) => links.eq(i).attr("href"));

				//check if no image found
				if (!urls.length) return;

				//Make it pretty
				let embed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle(`Showing random image for: "${imagesearch}"`)
					.setTimestamp()
					.setImage(urls[Math.floor(Math.random() * urls.length)])
					.setFooter("Thank you for using Terminal!")
					.setAuthor(message.author.tag, message.author.avatarURL());

				//send it back
				message.channel.send(embed);
			});
		}

		//call the function
		image(message);
	},
};
