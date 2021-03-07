const mongoose = require("mongoose");
const Guild = require("../../db/guild");
const config = require("../../config.json");
const currencyFunctions = require("../../util/eco/currencyFunctions");
const userConfig = require("../../db/economy");
const { stripIndents, oneLine } = require("common-tags");

module.exports = async (client, message) => {
	try {
		if (message.author.bot) return;
		if (message.channel.type === "dm") {
			return;
		}
		const prefix = message.guild.commandPrefix;
		if (message.content === "deepweb") {
			message.channel.send(
				`Hello, my prefix in this server is \`${prefix}\`. To see a list of commands run \`${prefix}help\``
			);
		}
		if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
			message.channel
				.send(oneLine`Ping me? For help with commands:\`${prefix}commands\` or \`${prefix}help\` for a list of commands!
				To get support run: \`${prefix}support\`
				`);
		}

		const settings = await Guild.findOne(
			{
				GuildID: message.guild.id,
			},
			async (err, guild) => {
				if (err) console.error(err);
				if (!guild) {
					const newGuild = new Guild({
						_id: mongoose.Types.ObjectId(),
						GuildID: message.guild.id,
						guildName: message.guild.name,
						logChannelID: null,
						StaffRole: String,
					});

					newGuild
						.save()
						.then((result) => console.log(result))
						.catch((err) => console.error(err));
					if (message.guild) {
						if (!message.member.hasPermission("SEND_MESSAGES")) {
							return;
						} else {
							return message.channel
								.send(
									"This server was not in our database! We have now added and you should be able to use bot commands."
								)
								.then((m) => m.delete({ timeout: 5000 }));
						}
					}
				}
				//! economy
				// gives the user 5 bank space per chat, may be buffed.

				const randomSpace = Math.round(Math.random() * 5) + 1;
				currencyFunctions.giveBankSpace(
					message.author.id,
					message.guild.id,
					randomSpace
				);

				if (message.author.bot) {
					return;
				} else {
					await currencyFunctions
						.findUser(message.author.id, message.guild.id)
						.then((data) => {
							if (!data) {
								let newData = new userConfig({
									guildName: message.guild.name,
									userId: message.author.id,
									guildId: message.guild.id,
								});
								newData.save();
							}
						});
				}
			}
		);
	} catch (error) {
		return console.log(error);
	}
};
