const discordXP = require("discord-xp");
const Discord = require("discord.js");
module.exports = {
	name: "createuserxp",
	aliases: ["cuxp"],
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: "[mention]",
	requiredPermissions: ["ADMINISTRATOR"],
	description: "Create an XP entry in the database",
	category: "Leveling",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (message.author.id !== message.guild.ownerID) {
			const nopermsEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Create user XP unsuccessful")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription("You are not the owner of the server.")
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(nopermsEmbed);
			return;
		}

		let target = message.mentions.members.first() || message.author;
		discordXP.createUser(target.id, message.guild.id);

		message.channel.send(`Created database entry for ${target}.`);
	},
};
