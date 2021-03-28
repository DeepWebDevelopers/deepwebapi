const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "bed",
			aliases: ["undermybed"],
			group: "images",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "beg_meme_img_command",
			description: "There's a monster under my bed!",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 29,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		let pfp1;
		let pfp2;

		let target = message.mentions.users.first();
		if (!target) {
			pfp1 = client.user.displayAvatarURL({
				dynamic: false,
				format: "png",
			});

			pfp2 = message.author.displayAvatarURL({
				dynamic: false,
				format: "png",
			});
		} else {
			pfp1 = message.author.displayAvatarURL({
				dynamic: false,
				format: "png",
			});

			pfp2 = target.displayAvatarURL({
				dynamic: false,
				format: "png",
			});
		}

		canvacord.bed(pfp1, pfp2).then((data) => {
			let att = new Discord.MessageAttachment()
				.setFile(data)
				.setName("bed.png");

			message.channel.send(att);
		});
	}
};
