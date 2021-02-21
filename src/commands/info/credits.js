const commando = require("discord.js-commando");
const Discord = require("discord.js");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "credits",
			aliases: ["credit", "bot-credits"],
			group: "info",
			memberName: "creditscommand",
			description: "Shows the bots credits.",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 120,
			},
		});
	}
	async run(message, args) {
		const embed = new Discord.MessageEmbed()
			.setTimestamp()
			.setTitle(`${message.client.user.username} credits.`)
			.setDescription(
				"These credits go to the users who help in the creation of the bot!"
			)
			.setColor("#c28ada")
			.addFields(
				{
					name: "Lead Developer",
					value: "`ThatGuyJamal#2695` (<@370637638820036608>)",
					inLine: true,
				}, // ThatGuyJamal#2695
				{
					name: "Logo Artist",
					value: "`🌊✨𝐒𝐨𝐫𝐚✨🌊#3412` (<@534202524417392652>)",
					inLine: true,
				}, // 🌊✨𝐒𝐨𝐫𝐚✨🌊#3412
				{ name: "Bot Dashboard", value: "N/A", inLine: true }
				// { name: '', value: "", inLine:true },
			)
			.setFooter("Powered by Javascript.");
		message.channel.send(embed);
	}
};
