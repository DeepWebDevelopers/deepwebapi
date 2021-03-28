const canvacord = require("canvacord").Canvas
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "jail",
			aliases: ["jail-them"],
			group: "images",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "jail_img_command",
			description: "jail someome!",
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

        if(!target) return message.reply("Could not find mentioned user.")

        const pfp = target.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        canvacord.jail(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("jail.png")

            message.channel.send(att)
        })
    }
}