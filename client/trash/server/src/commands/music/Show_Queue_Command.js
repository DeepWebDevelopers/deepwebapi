const commando = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");

module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "song-queue",
			aliases: ["q", "queue"],
			group: "music",
			memberName: "music-ccxvommand-0wfweofijw",
			description: "..",
			userPermissions: ["CONNECT", "VIEW_CHANNEL"],
			clientPermissions: ["SPEAK", "CONNECT", "ADD_REACTIONS"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		// const permissions = message.channel.permissionsFor(message.client.user);
		// if (!permissions.has(["MANAGE_MESSAGES", "ADD_REACTIONS"]))
		//   return message.reply("Missing permission to manage messages or add reactions");

		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue)
			return message.channel.send("❌ **Nothing playing in this server**");

		let currentPage = 0;
		const embeds = generateQueueEmbed(message, serverQueue.songs);

		const queueEmbed = await message.channel.send(
			`**Current Page - ${currentPage + 1}/${embeds.length}**`,
			embeds[currentPage]
		);

		try {
			await queueEmbed.react("⬅️");
			await queueEmbed.react("⏹");
			await queueEmbed.react("➡️");
		} catch (error) {
			console.error(error);
			message.channel.send(error.message).catch(console.error);
		}

		const filter = (reaction, user) =>
			["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) &&
			message.author.id === user.id;
		const collector = queueEmbed.createReactionCollector(filter, {
			time: 60000,
		});

		collector.on("collect", async (reaction, user) => {
			try {
				if (reaction.emoji.name === "➡️") {
					if (currentPage < embeds.length - 1) {
						currentPage++;
						queueEmbed.edit(
							`**Current Page - ${currentPage + 1}/${embeds.length}**`,
							embeds[currentPage]
						);
					}
				} else if (reaction.emoji.name === "⬅️") {
					if (currentPage !== 0) {
						--currentPage;
						queueEmbed.edit(
							`**Current Page - ${currentPage + 1}/${embeds.length}**`,
							embeds[currentPage]
						);
					}
				} else {
					collector.stop();
					reaction.message.reactions.removeAll();
				}
				await reaction.users.remove(message.author.id);
			} catch (error) {
				console.error(error);
				return message.channel.send(error.message).catch(console.error);
			}
		});
	}
};

function generateQueueEmbed(message, serverQueue) {
	let embeds = [];
	let k = 10;

	for (let i = 0; i < serverQueue.length; i += 10) {
		const current = serverQueue.slice(i, k);
		let j = i;
		k += 10;

		const info = current
			.map((track) => `${++j} - [${track.title}](${track.url})`)
			.join("\n");

		const embed = new MessageEmbed()
			.setTitle("Song Queue\n")
			.setThumbnail(message.guild.iconURL())
			.setColor("#c28ada")
			.setDescription(
				`**Current Song - [${serverQueue[0].title}](${serverQueue[0].url})**\n\n${info}`
			)
			.setTimestamp();
		embeds.push(embed);
	}
	return embeds;
}
