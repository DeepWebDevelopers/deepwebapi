const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "roleinfo",
			// aliases: ["r"],
			group: "information",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "role_info_command",
			description: "Sends info about a role.",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

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

		let roleembed = new Discord.MessageEmbed()
			.setColor("#2F3136")
			.setTitle(`Role Info: \`[  ${role.name}  ]\``)
			.setThumbnail(message.guild.iconURL())
			.addField("**ID**", `\`${role.id}\``, true)
			.addField("**Name**", role.name, true)
			.addField("**Hex**", role.hexColor, true)
			.addField("**Members Using role**", role.members.size, true)
			.addField("**Position**", role.position, true)
			.addField("**Mentionable**", status[role.mentionable], true)
			.setFooter(
				message.member.displayName,
				message.author.displayAvatarURL(),
				true
			)
			.setTimestamp();

		message.channel.send(roleembed);
	}
};
