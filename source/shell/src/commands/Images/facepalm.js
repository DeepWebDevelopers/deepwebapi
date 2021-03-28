const canvacord = require("canvacord").Canvas
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "facepalm",
			// aliases: [""],
			group: "images",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "facepalm_img_command",
			description: "🤦🏼‍♂️why...",
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
        if(!target) return message.reply("You can't facepalm nothing...these humans really stupid :/")
        const pfp = target.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        if(!pfp) return

        canvacord.facepalm(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("facepalm.png")

            message.channel.send(att)
        })
    }
}