const canvacord = require("canvacord").Canvas
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "gay",
			aliases: ["howgay"],
			group: "images",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "gay_img_command",
			description: "gay finder",
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

        if(!target) return message.reply("error")
        const pfp = target.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        if (!pfp) return message.reply("error");

        canvacord.rainbow(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("gay.png")

            message.channel.send(att)
        })
    }
}