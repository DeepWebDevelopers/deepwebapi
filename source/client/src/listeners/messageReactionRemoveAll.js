// const Discord = require("discord.js");
// module.exports = (client) => {
// 	client.on("messageReactionRemoveAll", (message) => {
// 		let modlog = message.guild.channels.cache.find((channel) =>
// 			channel.name.includes("t-modlog")
// 		);
// 		if (!modlog) return;

// 		const logEmbed = new Discord.MessageEmbed()
// 			.setColor("RANDOM")
// 			.setTitle("Message Reactions Cleared")
// 			.addFields(
// 				{
// 					name: "Channel:",
// 					value: `${message.channel.name} (${message.channel.id})`,
// 				},
// 				{
// 					name: "Message Sender:",
// 					value: `${message.author.username}#${message.author.discriminator} (${message.author.id})`,
// 				}
// 			)
// 			.setTimestamp();
// 		modlog.send(logEmbed);
// 	});
// };

module.exports.config = {
	displayName: "Message Reaction Clear",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
