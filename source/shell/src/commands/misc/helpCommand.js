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
			memberName: "",
			description: "",
			argsType: "multiple",
			guildOnly: true,
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
				.setDescription("Commands coming soon!")
				.addFields(
					{ name: "`Prefix`", value: `My prefix in this server is ${prefix}` },
					{ name: "`Documentation`", value: `` },
					{ name: "``", value: `` },
					{ name: "``", value: `` },
					{ name: "``", value: `` },
					{
						name: "`Want to build a bot like me?`",
						value: `You can check out the [Discord Bot Guide](${config.bot_docs}). Its a little something my creator has been working on.`,
					}
				)
				.setFooter(``)
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
			case "commands":
				//
				return message.reply("comming soon...");
				break;
			case "muterole":
				return message.reply("comming soon...");
				break;
		}
	}
};
