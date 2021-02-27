const { stripIndents, oneLine } = require("common-tags");
const Command = require("../../util/base");
const commando = require("discord.js-commando");

module.exports = class PrefixCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: "prefix",
			group: "config",
			memberName: "prefix",
			description: "Shows or sets the command prefix.",
			format: '[prefix/"default"/"none"]',
			guildOnly: true,
			throttling: {
				usages: 3,
				duration: 10,
			},
			details: oneLine`
				If no prefix is provided, the current prefix will be shown.
				If the prefix is "default", the prefix will be reset to the bot's default prefix.
				If the prefix is "none", the prefix will be removed entirely, only allowing mentions to run commands.
				Only administrators may change the prefix.
			`,
			examples: [
				"prefix",
				"prefix -",
				"prefix omg!",
				"prefix default",
				"prefix none",
			],

			args: [
				{
					key: "prefix",
					prompt: "What would you like to set the bot's prefix to?",
					type: "string",
					max: 15,
					default: "",
				},
			],
		});
	}

	async run(message, args) {
		// Just output the prefix
		if (!args.prefix) {
			const prefix = message.guild
				? message.guild.commandPrefix
				: this.client.commandPrefix;
			return message.reply(stripIndents`
				${
					prefix
						? `The command prefix is \`\`${prefix}\`\`.`
						: "There is no command prefix."
				}
				To run commands, use ${message.anyUsage("command")}.
			`);
		}

		// Check the user's permission before changing anything
		if (message.guild) {
			if (
				!message.member.hasPermission("ADMINISTRATOR") &&
				!this.client.isOwner(message.author)
			) {
				return message.reply(
					"❌ Only administrators may change the command prefix."
				);
			}
		} else if (!this.client.isOwner(message.author)) {
			return message.reply(
				"❌ Only the bot owner(s) may change the global command prefix."
			);
		}

		// Save the prefix
		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === "none" ? "" : args.prefix;
		let response;
		if (lowercase === "default") {
			if (message.guild) message.guild.commandPrefix = null;
			else this.client.commandPrefix = null;
			const current = this.client.commandPrefix
				? `\`\`${this.client.commandPrefix}\`\``
				: "no prefix";
			response = `Reset the command prefix to the default (currently ${current}).`;
		} else {
			if (message.guild) message.guild.commandPrefix = prefix;
			else this.client.commandPrefix = prefix;
			response = prefix
				? `Set the command prefix to \`\`${args.prefix}\`\`.`
				: "Removed the command prefix entirely.";
		}

		await message.reply(
			`${response} To run commands, use ${message.anyUsage("command")}.`
		);
		return null;
	}
};
