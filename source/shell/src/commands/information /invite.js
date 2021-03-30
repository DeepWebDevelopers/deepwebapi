const commando = require("discord.js-commando");
const Discord = require("discord.js");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "invite",
			// aliases: [""],
			group: "information",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "ADD_REACTIONS"],
			memberName: "invite_command",
			description: "sends a link to invite the bot",
			argsType: "multiple",
			guildOnly: false,
			throttling: {
				usages: 1,
				duration: 45,
			},
		});
	}
	async run(message, args) {
		try {
			try {
				const serverEmbed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle("Terminal Invite link")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setThumbnail(message.client.user.avatarURL())
					.addFields({
						name: "Click below",
						value: `[here](${config.auth})`,
					})
					.setTimestamp()
					.setFooter("Thank you for using Terminal!");
				message.author.send(serverEmbed);
				message.react("🤝");
			} catch {
				const serverEmbed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle("Servers")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setThumbnail(message.client.user.avatarURL())
					.addFields({
						name: `Invite link request by ${message.author.tag} \n click below.`,
						value: `[here](${config.auth})`,
					})
					.setTimestamp()
					.setFooter("Thank you for using Terminal!");
				message.author.send(serverEmbed);
				message.reply(
					"Looks like your dms are closed! Sending the invite link here!"
				);
				message.channel.send(serverEmbed);
				return;
			}
		} catch (error) {
			message.channel.send(`I have ran into an error. \n ${error}`)
			return console.log(err);
		}
	}
};
