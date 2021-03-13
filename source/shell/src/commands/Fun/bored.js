const axios = require("axios").default;
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "bored",
			// aliases: [""],
			group: "fun",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "bored_command",
			description: "..",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 2,
				duration: 10,
			},
		});
	}
	async run(message, args, client) {
		const prefix = message.guild.commandPrefix;

		axios.get("http://www.boredapi.com/api/activity/").then(async (res) => {
			const activity = res.data.activity;
			const type = res.data.type;
			const participants = res.data.participants;
			const price = res.data.price * 10;
			const key = res.data.key;
			const accessibility = res.data.accessibility * 10;

			const embed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("Are you bored?")
				.setDescription(
					`**Activity:** ${activity}\n**Type:** ${type}\n**Participants:** ${participants}\n**Price:** ${price} out of 10\n**Accessibility:** ${accessibility} out of 10`
				)
				.setTimestamp()
				.setFooter(key);
			message.channel.send(embed);
		});
	}
};
