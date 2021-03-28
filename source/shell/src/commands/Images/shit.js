const canvacord = require("canvacord").Canvas
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "shit",
			// aliases: [""],
			group: "images",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "shit_img_command",
			description: "well... shit",
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
	
        const target = message.mentions.users.first() || message.author
          if (!target) return message.reply("No target given.");
        const pfp = target.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        canvacord.shit(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("shit.png")

            message.channel.send(att)
        })
    }
}