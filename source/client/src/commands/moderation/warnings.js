const mongo = require("../../mongo");
const warnSchema = require("../../db/warn");
const Discord = require("discord.js");

module.exports = {
	name: "warnings",
	aliases: ["warns"],
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: "[mention]",
	description: "Display a user's warnings",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let target = message.mentions.users.first() || message.author;
		let guildId = message.guild.id;
		let userId = target.id;

		await mongo().then(async (mongoose) => {
			try {
				let data = await warnSchema.findOne({
					warnId: userId,
					guildId: guildId,
				});

				if (!data)
					return message.channel.send(`${target.tag} has no warnings. :)`);

				const embed = new Discord.MessageEmbed()
					.setColor("YELLOW")
					.setAuthor(message.author.tag, message.author.avatarURL())
					.setTitle(`Previous warnings for ${target.tag}`)
					.setTimestamp()
					.setFooter("Thank you for using Terminal!");

				let warnlist = "";

				for (const warn of data.warnings) {
					const { warnDate, staffId, staffTag, reason } = warn;

					warnlist += `\`${reason}\` • On ${new Date(
						warnDate
					).toLocaleString()} by ${staffTag}\n`;
				}

				embed.setDescription(warnlist);
				message.channel.send(embed);
			} catch (err) {
				console.log(err);
				message.channel.send(`An error occurred: \`${err.message}\``);
			}
		});
	},
};
