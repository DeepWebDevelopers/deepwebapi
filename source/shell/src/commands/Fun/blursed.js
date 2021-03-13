const got = require("got");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "blursed",
			aliases: ["bluimg"],
			group: "fun",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "blursed_image_command",
			description: "Random img from blursed reddit",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 35,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		const embed = new Discord.MessageEmbed();
		got("https://www.reddit.com/r/blursedimages/random/.json").then(
			(response) => {
				//Fetch most of the data from the reddit post it recieves
				let content = JSON.parse(response.body);
				let permalink = content[0].data.children[0].data.permalink;
				let memeUrl = `https://reddit.com${permalink}`;
				let memeImage = content[0].data.children[0].data.url;
				let memeTitle = content[0].data.children[0].data.title;
				let memeUpvotes = content[0].data.children[0].data.ups;
				let memeDownvotes = content[0].data.children[0].data.downs;
				let memeNumComments = content[0].data.children[0].data.num_comments;

				//Put it all in an embed so it looks organized and pretty
				embed.setTitle(`${memeTitle}`);
				embed.setURL(`${memeUrl}`);
				embed.setImage(memeImage);
				embed.setColor("RANDOM");
				embed.setFooter(
					`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`
				);
				embed.setTimestamp();

				//Send it back
				message.channel.send(embed);
			}
		);
	}
};
