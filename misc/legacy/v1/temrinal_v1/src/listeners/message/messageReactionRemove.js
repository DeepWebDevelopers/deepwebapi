// const Discord = require("discord.js");
// module.exports = (client) => {
// 	client.on("messageReactionRemove", (reaction, user) => {
// 		let modlog = reaction.message.guild.channels.cache.find((channel) =>
// 			channel.name.includes("t-modlog")
// 		);
// 		if (!modlog) return;

// 		const logEmbed = new Discord.MessageEmbed()
// 			.setColor("RANDOM")
// 			.setTitle("Message Reaction Removed")
// 			.setDescription(
// 				`**Terminal Assigned?** ${reaction.me ? "Yes" : "No"}\n**Emoji:** ${
// 					reaction.emoji
// 				}`
// 			)
// 			.addFields(
// 				{
// 					name: "Channel:",
// 					value: `${reaction.message.channel.name} (${reaction.message.channel.id})`,
// 				},
// 				{
// 					name: "User:",
// 					value: `${user.username}#${user.discriminator} (${user.id})`,
// 				}
// 			)
// 			.setTimestamp();
// 		modlog.send(logEmbed);
// 	});
// };

module.exports.config = {
	displayName: "Message Reaction Remove",
	dbName: "Terminalmod",
	loadDBFirst: false,
};
