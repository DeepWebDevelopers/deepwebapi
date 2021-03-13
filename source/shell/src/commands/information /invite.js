const commando = require("discord.js-commando");
const Discord = require("discord.js");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "invite",
			aliases: ["support"],
			group: "information",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "invite_command",
			description: "sends the bots support invite and guild invite.",
			argsType: "multiple",
			guildOnly: false,
			throttling: {
				usages: 1,
				duration: 45,
			},
		});
	}
	async run(message, args) {
		if (!args[0])
			return message.reply(
				"I expected one of the following: `version`, `server`, `support`, `dwd`, `code`"
			);
		if (args[0] === "version") {
			const version = "0.0.4";

			const versionEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Bot Version")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription("Current version of Terminal is **" + version + "**.")
				.setThumbnail(message.client.user.avatarURL())
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(versionEmbed);
			return;
		} else if (args[0] === "server") {
			const serverEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Servers")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setThumbnail(message.client.user.avatarURL())
				.addFields({
					name: "Official Terminal server: ",
					value: `[here](${config.bserver})`,
				})
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(serverEmbed);
			return;
		} else if (args[0] === "support") {
			const supportEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Found a bug?")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription(
					"The best place to get help is in our discord server. Although you can try the other options below. Thanks."
				)
				.setThumbnail(message.client.user.avatarURL())
				.addFields(
					{
						name: "Support Server",
						value: `[Click me to join!](${config.bserver})`,
					},
					{
						name: "Github",
						value:
							"Post an [issue](https://github.com/DeepWebDevelopers/Terminal/issues) on my github repo.",
					},
					{
						name: "Email ",
						value: "Give us an email at `deepweb.api.biz@gmail.com`",
					},
					{
						name: "Offical Documentation",
						value: "coming soon...",
					}
				)
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(supportEmbed);
			return;
		} else if (args[0] === "dwd") {
			const dwdEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("DeepDevDev's Info")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription("Want to support my organization!")
				.setThumbnail(message.client.user.avatarURL())
				.addFields(
					{
						name: "Server Invite: ",
						value: `[DeepWebDevelopers](${config.bserver})`,
					},
					{
						name: "Github ",
						value: "Support our [github](https://github.com/DeepWebDevelopers)",
					}
				)
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(dwdEmbed);
			return;
		} else if (args[0] === "code") {
			const codeEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Terminal Code")
				.setAuthor(message.author.tag, message.author.avatarURL())
				.setDescription("Want to view my souce code?")
				.setThumbnail(message.client.user.avatarURL())
				.addFields({
					name: "Github ",
					value:
						"Link coming soon on [github](https://github.com/DeepWebDevelopers)",
				})
				.setTimestamp()
				.setFooter("Thank you for using Terminal!");
			message.channel.send(codeEmbed);
			return;
		}
	}
};
