const Discord = require("discord.js");
module.exports = {
	name: "roleremove",
	aliases: ["rremove"],
	minArgs: 2,
	maxArgs: -1,
	expectedArgs: "<user mention/>id> <role mention/id>",
	cooldown: "10s",
	permissions: ["MANAGE_ROLES"],
	description: "Removed a role from the user",
	category: "Moderation",
	run: async ({ message, args, text, client, prefix, instance }) => {
		let rMember =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]);

		if (!rMember)
			return message.channel.send(
				"Please provide a user to remove a role from."
			);

		let role =
			message.guild.roles.cache.find((r) => r.name == args[1]) ||
			message.guild.roles.cache.find((r) => r.id == args[1]) ||
			message.mentions.roles.first();

		if (!role)
			return message.channel.send(
				"Please provide a role to remove from said user."
			);

		if (!message.guild.me.hasPermission(["MANAGE_ROLES"]))
			return message.channel.send(
				"I don't have permission to perform this command. Please give me Manage Roles Permission!"
			);

		if (!rMember.roles.cache.has(role.id)) {
			let rolDEL_err = new MessageEmbed()
				.setColor(`#FF0000`)
				.setDescription(
					`Error ❌ | ${rMember.displayName}, Does not have this role!`
				);

			return message.channel.send(rolDEL_err);
		} else {
			await rMember.roles.remove(role.id).catch((e) => console.log(e.message));

			let rolDEL = new MessageEmbed()
				.setColor(`#00FF00`)
				.setDescription(
					`Success ✅ | ${rMember} has been removed from **${role.name}**`
				);

			message.channel.send(rolDEL);
		}
	},
};
