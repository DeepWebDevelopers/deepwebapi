const Discord = require("discord.js");
module.exports = {
	name: "setup",
	minArgs: 0,
	maxArgs: 0,
	cooldown: "5s",
	description: "Create all the channels/roles the bot needs",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const msg = await message.channel.send(
			"Are you sure you want to nuke this channel? This Action cannot be undone!"
		);
		await msg.react("✅");
		await msg.react("❌");
		const filter = (reaction, user) => {
			return (
				(reaction.emoji.name === "✅" || reaction.emoji.name === "❌") &&
				user.id === message.author.id
			);
		};

		msg
			.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
			.then(async (reaction) => {
				if (reaction.first().emoji.name === "✅") {
					await message.channel.send("**TACTICAL NUKE INCOMING!**"); // this is optional, you can delete this if you want
					let channel = message.guild.channels.cache.get(message.channel.id); // get the channel to nuke (basically the channel the command was sent in)
					var position = channel.position; // We need the channel permission to we can move the cloned channel to where the original channel was.

					channel.clone().then((channel2) => {
						// clones the channel, we define this channel as 'channel2' in a 'then' statement
						channel2.setPosition(position); // this is where we used the position variable
						channel.delete(); // now that we put the cloned channel where need it to be, we can delete the original
						channel2.send("**NUKED CHANNEL SUCCESSFULLY**"); // sends a message to confirm that it was able to nuke it
						channel2.send("https://giphy.com/gifs/80s-akira-oQtO6wKK2q0c8"); // sends an anime nuke gif
					});
				} else if (reaction.first().emoji.name === "❌") {
					const embed = new Discord.MessageEmbed()
						.setDescription(
							`Command has been canceled by ${message.author.tag}`
						)
						.setColor("GREEN")
						.setTimestamp();
					message.channel.send(embed);
				}
			})
			.catch(() => {
				const embed = new Discord.MessageEmbed()
					.setTitle(`Error Detected`)
					.setDescription(
						`:no_entry: You Have Ran Out Of Time To Respond. Please Try Again. :no_entry:`
					)
					.setColor(`RED`);
				return message.channel.send(embed);
			});
	},
};
