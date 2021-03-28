const canvacord = require("canvacord").Canvas;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "beautiful",
			// aliases: [""],
			group: "images",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "beautiful_img_command",
			description: "Oh this? This is beautiful!",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 35,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		const target = message.mentions.users.first() || message.author;
		const pfp = target.displayAvatarURL({
			dynamic: false,
			format: "png",
		});

		canvacord.beautiful(pfp).then((data) => {
			let att = new Discord.MessageAttachment()
				.setFile(data)
				.setName("beautiful.png");

			message.channel.send(att);
		});
	}
};
