const Discord = require("discord.js");
module.exports = {
	name: "roleinfo",
	aliases: ["rrinfo"],
	minArgs: 1,
	maxArgs: -1,
	expectedArgs: "<role mention/id>",
	cooldown: "10s",
	permissions: ["SEND_MESSAGES"],
	description: "Gives a user info on a role",
	category: "Information",
	run: async ({ message, args, text, client, prefix, instance }) => {
		if (!args[0]) return message.channel.send("**Please Enter A Role!**");
		let role =
			message.mentions.roles.first() ||
			message.guild.roles.cache.get(args[0]) ||
			message.guild.roles.cache.find(
				(r) => r.name.toLowerCase() === args.join(" ").toLocaleLowerCase()
			);
		if (!role) return message.channel.send("**Please Enter A Valid Role!**");

		const status = {
			false: "No",
			true: "Yes",
		};

		let roleembed = new MessageEmbed()
			.setColor("#2F3136")
			.setTitle(`Role Info: \`[  ${role.name}  ]\``)
			.setThumbnail(message.guild.iconURL())
			.addField("**ID**", `\`${role.id}\``, true)
			.addField("**Name**", role.name, true)
			.addField("**Hex**", role.hexColor, true)
			.addField("**Members**", role.members.size, true)
			.addField("**Position**", role.position, true)
			.addField("**Mentionable**", status[role.mentionable], true)
			.setFooter(
				message.member.displayName,
				message.author.displayAvatarURL(),
				true
			)
			.setTimestamp();

		message.channel.send(roleembed);
	},
};
