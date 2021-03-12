const config = require("../../../../config/config.json");
const Discord = require("discord.js");
module.exports = {
	name: "invite",
	minArgs: 0,
	maxArgs: 0,
	cooldown: "30s",
	permissions: ["SEND_MESSAGES"],
	description: "Invite link to add the bot to a server",
	category: "Information",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!message.guild.me.hasPermission("ADD_REACTIONS"))
			return message.reply(
				`I seams I dont have permissions to react. [link](${config.bserver})`
			);
		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("[Terminal OAUTH2 Invite Link]")
			.setURL(config.auth2)
			.setDescription(`[Terminal Support Server](${config.bserver})`)
			.setTimestamp();
		try {
			await message.react("✅");
			message.author.send(embed);
			message
				.reply("Check your dm's for my invite link")
				.then((m) => m.delete({ timeout: 3000 }));
		} catch {
			message.channel.send("Woops your DM's are closed so im Sending it here!");
			message.channel.send(embed);
		}
	},
};
