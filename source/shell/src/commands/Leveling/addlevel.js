const discordXP = require("discord-xp");
const Discord = require("discord.js");
const commando = require("discord.js-commando");
const config = require("../../../config/config.json");
module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			name: "addlevel",
			aliases: ["+lvl"],
			group: "leveling",
			userPermissions: ["SEND_MESSAGES", "ADMINISTRATOR"],
			clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
			memberName: "add_level_command",
			description: "Adds a level to the user in your guild.",
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 25,
			},
		});
	}
	async run(message, args, client) {
		if (!args[0]) return message.reply("You can give nothing a level...");
		const prefix = message.guild.commandPrefix;
		let target = message.mentions.members.first();

		if (target) {
			let amountToAdd = parseInt(args[1]);
			if (isNaN(amountToAdd))
				return message.channel.send("Specify a **number** please.");

			discordXP.appendLevel(target.id, message.guild.id, amountToAdd);
			setTimeout(async () => {
				let XPuser = await discordXP.fetch(target.id, message.guild.id);

				message.channel.send(
					`${message.author} has given **${amountToAdd}** levels to ${target}, they are now at level **${XPuser.level}**.`
				);
			}, 1000);
		} else if (!target) {
			let amountToAdd = parseInt(args[0]);
			if (isNaN(amountToAdd))
				return message.channel.send("Specify a **number** please.");

			discordXP.appendLevel(message.author.id, message.guild.id, amountToAdd);
			setTimeout(async () => {
				let XPuser = await discordXP.fetch(message.author.id, message.guild.id);

				message.reply(
					`I have given you **${amountToAdd}** levels, you are now at level **${XPuser.level}**.`
				);
			}, 1000);
		}
	}
};
