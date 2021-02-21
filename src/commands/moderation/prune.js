const { Command } = require("discord.js-commando");

module.exports = class PruneCommand extends (
	Command
) {
	constructor(client) {
		super(client, {
			name: "prune",
			aliases: ["delete-messages", "bulk-delete", "purge", "clear", "clean"],
			description: "Delete up to 99 recent messages.",
			group: "moderation",
			memberName: "prune",
			guildOnly: true,
			ownerOnly: false,
			clientPermissions: ["MANAGE_MESSAGES", "READ_MESSAGE_HISTORY"],
			userPermissions: ["MANAGE_CHANNELS", "MANAGE_MESSAGES"],
			args: [
				{
					key: "deleteCount",
					prompt: "How many messages do you want to delete?",
					type: "integer",
					validate: (deleteCount) => deleteCount < 100 && deleteCount > 0,
				},
			],
			throttling: {
				usages: 5,
				duration: 60,
			},
		});
	}

	run(message, { deleteCount }) {
		const prefix = require("../../config.json");
		message.channel
			.bulkDelete(deleteCount)
			.then((messages) =>
				message.say(
					`Successfully Deleted: ${messages.size} messages. (deleted by: ${message.author.tag})`
				)
			)
			.catch((e) => {
				// console.error(e);
				return message.say(
					`:x: You cant delete messages over 14 days old! Use my \`${prefix.prefix}nuke\` command to clear the whole channel.`
				);
			});
	}
};
