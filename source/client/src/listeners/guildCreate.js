const Discord = require("discord.js");

//Whenever the bot joins a new Discord server
module.exports = (client) => {
	client.on("guildCreate", async (joinedGuild) => {
		//Creates a channel
		await joinedGuild.channels.create("read-me", {
			type: "text",
		});

		//Looks for the channel
		let readme = joinedGuild.channels.cache.find(
			(channel) => channel.name === "read-me"
		);

		const readmeEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("Read before using Terminal")
			.setDescription(
				"**Before you use me please do the following or I will not work properly:\n**\n¬ @everyone should **NOT** have `send messages` enabled\n¬ Do not modify the permissions I generated for myself or I will **NOT** work properly\n¬ Perform `setup`\n¬ The higher my role is, the better the `chatmute` command will work\n¬ I work best with admin permissions."
			)
			.setThumbnail(client.user.avatarURL())
			.setTimestamp()
			.setFooter("Thank you for inviting Terminal!");

		//Sends the embedded message to that channel
		readme.send(readmeEmbed);

		//Updates status to match server count, however, there is a rate limit, so sometimes the bot will not update the status
		let serverText = "servers";
		if (client.guilds.cache.size === 1) serverText = "server";

		client.user.setPresence({
			activity: {
				name: `g?help | ${client.guilds.cache.size} ${serverText}`,
				type: "STREAMING",
				url: `https://www.youtube.com/watch?v=AhT83rwwF44`, //get noobed
			},
			status: "online",
		});
	});
};

module.exports.config = {
	displayName: "Server Join",
	dbName: "Terminalguildcreate",
	loadDBFirst: true,
};
