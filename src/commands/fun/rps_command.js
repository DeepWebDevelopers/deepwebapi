const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
module.exports = class RPSCommand extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "rps",
			group: "fun",
			memberName: "games=rps-command",
			description: "Lets the bot play a game with you!",
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 15,
			},
		});
	}
	async run(message, args, client) {
		const rps = ["scissors", "rock", "paper"];
		const res = ["Scissors :scissors:", "Rock :rock:", "Paper :newspaper:"];
		let userChoice;
		if (args.length) userChoice = args[0].toLowerCase();
		if (!rps.includes(userChoice))
			return message.channel.send("Please enter rock, paper, or scissors");
		userChoice = rps.indexOf(userChoice);
		const botChoice = Math.floor(Math.random() * 3);
		let result;
		if (userChoice === botChoice) result = "It's a draw!";
		else if (botChoice > userChoice || (botChoice === 0 && userChoice === 2))
			result = `** DeepWeb.API** wins!`;
		else result = `**${message.member.displayName}** wins!`;
		const embed = new Discord.MessageEmbed()
			.setTitle(
				`${message.member.displayName} vs. ${message.client.user.username}`
			)
			.setColor("member")
			.addField("Your Choice:", res[userChoice], true)
			.addField(` DeepWeb.API\'s Choice`, res[botChoice], true)
			.addField("Result", result, true)
			.setFooter(
				message.member.displayName,
				message.author.displayAvatarURL({ dynamic: true })
			)
			.setTimestamp()
			.setColor("RANDOM")
			.setColor(message.guild.me.displayHexColor);
		message.channel.send(embed);
	}
};
