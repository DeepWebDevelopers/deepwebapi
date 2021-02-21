//! WARNING!!! THIS COMMAND IS AGAINST DISCORD TOS. IF USED YOUR BOT COULD BE BANNED/BLOCK FROM SERVERS.

const commando = require("discord.js-commando");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name:
				"mass-dm000000000020210300313001032013001490387428734298794283794879837",
			group: "owner",
			memberName: "mdm",
			description: "Mass Dms everyone in the server your in.",
			userPermissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
			clientPermissions: ["ADMINISTRATOR"],
			ownerOnly: true,
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 1,
				duration: 10000000,
			},
		});
	}
	async run(message, args) {
		if (message.author.id !== "370637638820036608") {
			return message.channel.send(`Only the bot Dev can use this command! `);
		}
		if (!args[0]) return message.reply("you need to provide a role");
		if (!args[1]) return message.reply("you need to provide a message");
		let argsf = message.content.split(" ").slice(2);
		var argresult = argsf.join(" ");
		const role = message.mentions.roles.first();
		await message.guild.roles.cache.get(role.id).members.forEach((member) => {
			member
				.send(argresult)
				.catch((e) =>
					message.author.send(
						`<@${role.id}> | Couldn't DM member ${member.user.tag}`
					)
				);
		});
		let embed = new discord.MessageEmbed()
			.setDescription(
				`:white_check_mark: | Message has been Successfully Sent to all **${role.id}**`
			)
			.setColor(0x1d1d1d)
			.setTitle("Message has been sent.");
		message.channel.send(embed);
	}
};
