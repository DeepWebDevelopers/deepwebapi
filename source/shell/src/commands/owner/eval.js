const process = require("child_process");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "eval:",
			// aliases: [""],
			group: "owner",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "eval_owner_command",
			description: "eval something",
			argsType: "multiple",
			guildOnly: true,
			ownerOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;
		
		if(!args) return message.reply("You gave me nothing to evaluate!")

		//Execute command specified and send the result
		process.exec(args.join(" "), (error, stdout) => {
			let response = error || stdout;
			if (response.length > 2000) response = response.substr(0, 1997) + "...";
			message.channel
				.send(response, {
					code: "asciidoc",
					split: "\n",
				})
				.catch((err) => message.channel.send(err));
		});

		return;
	}
};
