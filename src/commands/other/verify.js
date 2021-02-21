const Discord = require("discord.js");
const mongoose = require("mongoose");
const verifySettings = require("../../db/guildVer");
const commando = require("discord.js-commando");
module.exports = class Command extends (
	commando.Command
) {
	constructor(client) {
		super(client, {
			name: "verify",
			group: "other",
			memberName: "verify-command",
			description: "...",
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 10,
			},
		});
	}
	async run(message, args) {
		const prefix = message.guild.commandPrefix;
		await message.delete();

		verifySettings.findOne({ GuildID: message.guild.id }, async (err, data) => {
			if (!data) {
				return message.channel.send(
					`No verification data found! Run \`${prefix}v-set\` for help.`
				);
			}
			if (message.author.bot) return;
			if (message.channel.id === data.VerifyChannelID) {
				await message
					.reply(`You have been Verifyed!`)
					.then((m) => m.delete({ timeout: 7000 }));
				let role = data.VerifiedRoleID;
				if (role) {
					try {
						await message.member.roles.add(role);
					} catch (err) {
						console.log(err);
					}
				}
			}
		});
	}
};
