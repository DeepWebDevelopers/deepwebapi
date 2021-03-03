const commando = require("discord.js-commando");
const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const { trimArray } = require("../../util/util");
const flags = {
	DISCORD_EMPLOYEE: "Discord Employee",
	PARTNERED_SERVER_OWNER: "Discord Partner",
	BUGHUNTER_LEVEL_1: "Bug Hunter (Level 1)",
	BUGHUNTER_LEVEL_2: "Bug Hunter (Level 2)",
	HYPESQUAD_EVENTS: "HypeSquad Events",
	HOUSE_BRAVERY: "House of Bravery",
	HOUSE_BRILLIANCE: "House of Brilliance",
	HOUSE_BALANCE: "House of Balance",
	EARLY_SUPPORTER: "Early Supporter",
	TEAM_USER: "Team User",
	SYSTEM: "System",
	VERIFIED_BOT: "Verified Bot",
	EARLY_VERIFIED_DEVELOPER: "Early Verified Bot Developer",
};
const deprecated = ["DISCORD_PARTNER", "VERIFIED_DEVELOPER"];

module.exports = class Command extends commando.Command {
	constructor(client) {
		super(client, {
			// 			name: "whois",
			// 			aliases: ["user-info"],
			// 			group: "server",
			// 			memberName: "whois-command",
			// 			description: "Tells you user info",
			// 			argsType: "multiple",
			// 			guildOnly: true,
			// 			throttling: {
			// 				usages: 2,
			// 				duration: 15,
			// 			},
			// 		});
			// 	}
			// 	async run(message, args) {
			// 		if (message.author.bot) return;
			// 		let userArray = message.content.split(" ");
			// 		let userArgs = userArray.slice(1);
			// 		let member =
			// 			message.mentions.members.first() ||
			// 			message.guild.members.cache.get(userArgs[0]) ||
			// 			message.guild.members.cache.find(
			// 				(x) =>
			// 					x.user.username.toLowerCase() === userArgs.slice(0).join(" ") ||
			// 					x.user.username === userArgs[0]
			// 			) ||
			// 			message.member;
			// 		if (member.presence.status === "dnd")
			// 			member.presence.status = "Do Not Disturb";
			// 		if (member.presence.status === "online") member.presence.status = "Online";
			// 		if (member.presence.status === "idle") member.presence.status = "Idle";
			// 		if (member.presence.status === "offline")
			// 			member.presence.status = "offline";
			// 		let x = Date.now() - member.createdAt;
			// 		let y = Date.now() - message.guild.members.cache.get(member.id).joinedAt;
			// 		const joined = Math.floor(y / 86400000);

			// 		const moment = require("moment");
			// 		const joineddate = moment
			// 			.utc(member.joinedAt)
			// 			.format("dddd, MMMM Do YYYY, HH:mm:ss");
			// 		let status = member.presence.status;

			// 		const Discord = require("discord.js");
			// 		const { MessageEmbed } = require("discord.js");
			// 		const whois = new Discord.MessageEmbed()
			// 			.setAuthor(member.user.tag, member.user.displayAvatarURL())
			// 			.setTimestamp()
			// 			.setColor("RANDOM")
			// 			.setImage(member.user.displayAvatarURL())
			// 			.addField("Member ID", member.id)
			// 			.addField("Roles", `<@&${member._roles.join("> <@&")}>`)
			// 			.addField(
			// 				"Account Created On:",
			// 				` ${moment.utc(member.user.createdAt).format("dddd, MMMM Do YYYY")}`,
			// 				true
			// 			)
			// 			.addField(
			// 				"Joined the server At",
			// 				`${joineddate} \n> ${joined} day(S) Ago`
			// 			)
			// 			.addField("Current Status", status);
			// 		message.channel.send(whois).catch((err) => console.error(err));
			// 		return;
			// 	}
			// };

			name: "user",
			aliases: ["user-info", "member", "member-info", "profile", "whois"],
			group: "info",
			memberName: "user",
			description: "Responds with detailed information on a user.",
			clientPermissions: ["EMBED_LINKS"],
			args: [
				{
					key: "user",
					prompt: "Which user would you like to get information on?",
					type: "user",
					default: (msg) => msg.author,
				},
			],
		});
	}

	async run(msg, { user }) {
		const userFlags = user.flags
			? user.flags.toArray().filter((flag) => !deprecated.includes(flag))
			: [];
		const embed = new MessageEmbed()
			.setColor("#c28ada")
			.setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }))
			.setAuthor(user.tag)
			.addField(
				"❯ Discord Join Date",
				moment.utc(user.createdAt).format("MM/DD/YYYY h:mm A"),
				true
			)
			.addField("❯ ID", user.id, true)
			.addField("❯ Bot?", user.bot ? "Yes" : "No", true)
			.addField(
				"❯ Flags",
				userFlags.length
					? userFlags.map((flag) => flags[flag]).join(", ")
					: "None"
			);
		if (msg.guild) {
			try {
				const member = await msg.guild.members.fetch(user.id);
				const defaultRole = msg.guild.roles.cache.get(msg.guild.id);
				const roles = member.roles.cache
					.filter((role) => role.id !== defaultRole.id)
					.sort((a, b) => b.position - a.position)
					.map((role) => role.name);
				embed
					.addField(
						"❯ Server Join Date",
						moment.utc(member.joinedAt).format("MM/DD/YYYY h:mm A"),
						true
					)
					.addField(
						"❯ Highest Role",
						member.roles.highest.id === defaultRole.id
							? "None"
							: member.roles.highest.name,
						true
					)
					.addField(
						"❯ Highst Role",
						member.roles.hoist ? member.roles.hoist.name : "None",
						true
					)
					.addField(
						`❯ Roles (${roles.length})`,
						roles.length ? trimArray(roles, 6).join(", ") : "None"
					)
					.setColor(member.displayHexColor);
			} catch {
				embed.setFooter("Basic user info");
			}
		}
		return msg.embed(embed);
	}
};
