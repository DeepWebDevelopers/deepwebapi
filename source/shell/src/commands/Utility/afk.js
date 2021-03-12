const Discord = require("discord.js");
const AFK = require("../../db/afk");
module.exports = {
	name: "afk",
	minArgs: 1,
	maxArgs: -1,
	cooldown: "1m",
	expectedArgs: "<reason>",
	description: "Notify member is offline or AFK",
	category: "Utility",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let afk_data = await AFK.findOne({ id: message.author.id });
		const reason1 = args.join(" ") || "Reason not specified";
		if (reason1.length > 100)
			return message.channel.send(
				":red_circle: The reason cannot exceed 100 characters."
			);

		if (!afk_data)
			await AFK.create({
				reason: reason1,
				id: message.author.id,
				isafk: true,
				timeAfk: Date.now(),
			});
		else {
			await AFK.updateOne(
				{ id: message.author.id },
				{
					reason: reason1,
					isafk: true,
					timeAfk: Date.now(),
				}
			);
		}

		const embedAFKUser = new Discord.MessageEmbed()
			.setAuthor(
				message.author.tag,
				message.author.displayAvatarURL({ dynamic: true })
			)
			.setColor("RANDOM")
			.setDescription(
				"AFk logged! " +
					message.author.tag +
					"** you are **AFK**\nIf you send a message again, you will be removed from the AFK list"
			)
			.addField(" **Reason:**", `${reason1}`);
		message.channel.send(embedAFKUser);
	},
};
