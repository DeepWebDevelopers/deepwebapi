const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "help",
			// aliases: ["command", "commands"],
			group: "misc",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "help_command",
			description: "Sends a user more information about how I work...",
			argsType: "multiple",
			guildOnly: false,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		if (!args[0]) {
			//
			let helpEmbed1 = new Discord.MessageEmbed()
				.setTitle("Help Command")
				.setDescription("**IM STILL IN DEVELOPMENT**!")
				.setColor("#2F3136")
				.addFields(
					{
						name: "Prefix",
						value: `My prefix in this server is \`${prefix}\` To change it run: **${prefix}prefix <new prefix>**`,
					},
					{
						name: "Documentation",
						value: `My Officual [Docs](https://google.com) *coming soon*`,
					},
					{
						name: "How To configure Me",
						value: `I have over one hundred commands built in and ready to use! To get started I recommend looked at my docs. You can also set my modlogging system, mute role, and verification system.`,
					},
					{
						name: "Support",
						value: `For any support or bugs with the bot, please contract the developers [here](${config.bserver})`,
					},
					{
						name: "Want to build A bot like me?",
						value: `You can check out the [Discord Bot Guide](${config.bot_docs}). Its a little something my creator has been working on.`,
					}
				)
				.addFields(
					{ name: "More Commands?", value: `\`${prefix}help docs\`` },
					{ name: "config", value: `\`${prefix}help config\`` },
					{ name: "general", value: `\`${prefix}help general\`` }
				)
				.setFooter(`Terminal is developed by ThatGuyJamal#2695`)
				.setThumbnail(
					message.client.user.displayAvatarURL({
						format: "png",
						dynamic: true,
					})
				)
				.setTimestamp();
			message.channel.send(helpEmbed1);
		} else if (message.author.bot || message.channel.type === "dm") {
			return;
		}
		let messageinfocontent = message.content.toLowerCase();
		switch (args[0]) {
			// ! Verification command
			case "docs":
				return message.reply("comming soon...");

				break;
			case "general":
				//
				return message.reply("comming soon...");
				break;
			case "config":
				return message.reply("comming soon...");
				break;
		}
	}
};
