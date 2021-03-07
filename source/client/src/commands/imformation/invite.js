const config = require("../../../../config/config.json");
const Discord = require("discord.js");
module.exports = {
	name: "invite",
	minArgs: 0,
	maxArgs: 0,
	permissions: ["SEND_MESSAGES"],
	description: "Invite link to add the bot to a server",
	category: "Information",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("[Terminal OAUTH2 Invite Link]")
			.setURL(config.auth)
			.setDescription(`[Terminal Support Server](${config.bserver})`)
			.setTimestamp();
		try {
			await message.author.send(embed);
		} catch {
			message.channel.send("Woops your DM's are closed so im Sending it here!");
			message.channel.send(embed);
		}
	},
};
