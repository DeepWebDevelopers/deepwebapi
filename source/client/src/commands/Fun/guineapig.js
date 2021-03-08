const cheerio = require("cheerio");
const Discord = require("discord.js");
const request = require("request");
module.exports = {
	name: "guineapig",
	aliases: ["pig"],
	minArgs: 0,
	maxArgs: 0,
	description: "Random picture of a Guinea Pig",
	category: "Fun & Games",
	run: async ({ message, args, text, client, prefix, instance }) => {
		//All images come from dogpile, it is much easier and faster than google images
		function image(message) {
			var options = {
				//The search url
				url: "http://results.dogpile.com/serp?qc=images&q=" + "guinea pig",
				method: "GET",
				headers: {
					Accept: "text/html",
					"User-Agent": "Chrome",
				},
			};

			request(options, function (error, response, responseBody) {
				//Error = cancel
				if (error) return;

				//Load the response's body
				$ = cheerio.load(responseBody);

				var links = $(".image a.link");
				//Gets all the image urls in a array
				var urls = new Array(links.length)
					.fill(0)
					.map((v, i) => links.eq(i).attr("href"));

				//If no urls, cancel
				if (!urls.length) return;

				//Randomize the title of the embed
				let randomize = [
					"Piggy!",
					"awww",
					"Guinea pig!",
					"🐹",
					"r/guineapigs",
					"Snuggle time!",
					"G u i n e a p i g",
					"P i g g y",
					"Guinea pog",
				];
				let messageTitle;
				let randomTitle = Math.floor(Math.random() * randomize.length);
				messageTitle = randomize[randomTitle];

				//Make it pretty
				let embed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle(messageTitle)
					.setTimestamp()
					.setImage(urls[Math.floor(Math.random() * urls.length)])
					.setFooter("Thank you for using Terminal!")
					.setAuthor(message.author.tag, message.author.avatarURL());

				//Send it back
				message.channel.send(embed);
			});
		}

		//Call the function
		image(message);
	},
};
