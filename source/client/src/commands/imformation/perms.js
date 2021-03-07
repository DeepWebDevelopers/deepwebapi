const config = require("../../../../config/config.json");
const Discord = require("discord.js");
module.exports = {
	name: "perms",
	minArgs: 0,
	maxArgs: 0,
	cooldown: "15s",
	// expectedArgs: "",
	permissions: ["SEND_MESSAGES"],
	description: "Shows a users permission via channel.",
	category: "Information",
	run: async ({ message, args, text, client, prefix, instance }) => {
		const yes = "✔️";
		const no = "❌";
		const x = "```";
		const s = "📛";
		const c = "♨️";

		const permissions = [
			"CREATE_INSTANT_INVITE",
			"KICK_MEMBERS",
			"BAN_MEMBERS",
			"ADMINISTRATOR",
			"MANAGE_CHANNELS",
			"MANAGE_GUILD",
			"ADD_REACTIONS",
			"VIEW_AUDIT_LOG",
			"PRIORITY_SPEAKER",
			"STREAM",
			"VIEW_CHANNEL",
			"SEND_MESSAGES",
			"SEND_TTS_MESSAGES",
			"MANAGE_MESSAGES",
			"EMBED_LINKS",
			"ATTACH_FILES",
			"READ_MESSAGE_HISTORY",
			"MENTION_EVERYONE",
			"USE_EXTERNAL_EMOJIS",
			"VIEW_GUILD_INSIGHTS",
			"CONNECT",
			"SPEAK",
			"MUTE_MEMBERS",
			"DEAFEN_MEMBERS",
			"MOVE_MEMBERS",
			"USE_VAD",
			"CHANGE_NICKNAME",
			"MANAGE_NICKNAMES",
			"MANAGE_ROLES",
			"MANAGE_WEBHOOKS",
			"MANAGE_EMOJIS",
		];

		/**
		 * @param {string} text - Should be a string
		 */

		function caps(text) {
			if (typeof text != "string") throw new Error("Param should be a string");
			return text
				.toLowerCase()
				.replace(/_/g, " ")
				.replace(/\b[a-zA-Z]/g, (m) => m.toUpperCase());
		}

		// your handler

		const channel = message.mentions.channels.first() || message.channel;

		let user =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.member;
		let userId = user.user.id;

		let description = `Server - ${s}\n${
			message.mentions.channels.first()?.name || "Current Channel"
		} - ${c}\n\n${s} | ${c}\n`;

		let embed = new Discord.MessageEmbed()
			.setTitle(`${user.user.username} Permissions`)
			.setColor(user.displayColor);

		permissions.forEach((perm) => {
			description += `${user.permissions.has(perm) ? yes : no} | ${
				channel.permissionsFor(userId).has(perm) ? yes : no
			} - ${caps(perm)}\n`;
		});
		embed.setDescription(x + description + x);

		await message.channel.send(embed);
	},
};

// https://sourceb.in/3svZVTO3tU
