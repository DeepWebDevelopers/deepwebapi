const commando = require("discord.js-commando");
module.exports = class clydeCommand extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "clyde",
			group: "fun",
			memberName: "clyde",
			description: "make clyde write what you writing",
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 5,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		const axios = require("axios");
		const { MessageEmbed } = require("discord.js");
		if (!args[0]) return message.channel.send("Please provide some text");
		axios
			.get(`https://nekobot.xyz/api/imagegen?type=clyde&text=${args.join(" ")}`)
			.then((res) => {
				const embed = new MessageEmbed().setImage(res.data.message);
				message.channel.send(embed);
			});
	}
};
