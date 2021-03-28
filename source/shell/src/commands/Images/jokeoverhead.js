const canvacord = require("canvacord").Canvas
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "jokeoverhead",
			aliases: ["joh"],
			group: "images",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "jokeoverhead_img_command",
			description: "Joke over head.",
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
        if(!target) return
        const pfp = target.displayAvatarURL({
            dynamic: false,
            format: "png"
        })

        canvacord.jokeOverHead(pfp).then(data => {
            let att = new Discord.MessageAttachment()
                .setFile(data)
                .setName("jokeOverHead.png")

            message.channel.send(att)
        })
    }
}