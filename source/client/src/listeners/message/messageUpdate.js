//? Need to fix 'bot' error

// const Discord = require("discord.js");
// module.exports = async (client, message) => {
// 	client.on("messageUpdate", (oldMessage, newMessage) => {
// 		let bot = message;
// 		if (newMessage.author.bot || message.channel.type === "dm") return;
// 		let modlog = newMessage.guild.channels.cache.find((channel) =>
// 			channel.name.includes("t-modlog")
// 		);
// 		if (!modlog) return;

// 		const logEmbed = new Discord.MessageEmbed()
// 			.setColor("RANDOM")
// 			.setTitle("Message Edited")
// 			.addFields(
// 				{
// 					name: "Old Message:",
// 					value: oldMessage.content,
// 				},
// 				{
// 					name: "New Message:",
// 					value: newMessage.content,
// 				},
// 				{
// 					name: "Message Sender:",
// 					value: `${newMessage.author.username}#${newMessage.author.discriminator} (${newMessage.author.id})`,
// 				},
// 				{
// 					name: "Channel:",
// 					value: `${newMessage.channel.name} (${newMessage.channel.id})`,
// 				}
// 			)
// 			.setTimestamp();
// 		modlog.send(logEmbed);
// 	});
// };

module.exports.config = {
	displayName: "Message Update",
	dbName: "Terminalmod",
	loadDBFirst: true,
};
