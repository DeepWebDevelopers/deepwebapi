const commando = require("discord.js-commando");
const got = require("got");
const Discord = require("discord.js");
module.exports = class MemeCommand extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "meme",
			group: "fun",
			memberName: "meme",
			description: "Sends a meme to a channel",
			clientPermissions: ["VIEW_CHANNEL"],
			argsType: "single",
			guildOnly: true,
			throttling: {
				usages: 5,
				duration: 25,
			},
		});
	}
	async run(message, args) {
		const embed = new Discord.MessageEmbed();
		try {
			got("https://www.reddit.com/r/memes/random/.json").then((response) => {
				let content = JSON.parse(response.body);
				let permalink = content[0].data.children[0].data.permalink;
				let memeUrl = `https://reddit.com${permalink}`;
				let memeImage = content[0].data.children[0].data.url;
				let memeTitle = content[0].data.children[0].data.title;
				let memeUpvotes = content[0].data.children[0].data.ups;
				let memeDownvotes = content[0].data.children[0].data.downs;
				let memeNumComments = content[0].data.children[0].data.num_comments;
				embed.addField(`${memeTitle}`, `[View thread](${memeUrl})`);
				embed.setImage(memeImage);
				embed.setColor("RANDOM");
				embed.setFooter(
					`👍 ${memeUpvotes} 👎 ${memeDownvotes} 💬 ${memeNumComments}`
				);
				message.channel.send(embed);
			});
		} catch (error) {
			console.log(error);
		}
	}
};
