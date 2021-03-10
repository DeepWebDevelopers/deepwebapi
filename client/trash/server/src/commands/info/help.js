const commando = require("discord.js-commando");
const { MessageEmbed, Message } = require("discord.js");
const Discord = require("discord.js");
const { stripIndents, oneLine } = require("common-tags");
const config = require("../../config.json");
const Command = require("../../util/base");
const { disambiguation } = require("../../util/util");

module.exports = class HelpCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: "help",
			group: "info",
			memberName: "helpcommand",
			aliases: ["command", "commands"],
			details: oneLine`
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.
            `,
			examples: ["help", "help prefix"],
			guarded: true,
			description:
				"Displays a list of available commands, or detailed information for a specified command.",
			userPermissions: ["SEND_MESSAGES"],
			clientPermissions: ["SEND_MESSAGES"],
			argsType: "multiple",
			guildOnly: false,
			ownerOnly: false,
			nsfw: false,
			args: [
				{
					key: "command",
					prompt: "Which command would you like to view the help for?",
					type: "string",
					default: "",
				},
			],
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}
	async run(message, args, prefix, client) {
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(
			args.command,
			false,
			message
		);

		const showAll = args.command && args.command.toLowerCase() === "all";

		if (args.command && !showAll) {
			if (commands.length === 1) {
				let help = `
					${oneLine`
						__Command **${commands[0].name}**:__ ${commands[0].description}
						${commands[0].guildOnly ? " (Usable only in servers)" : ""}
						${commands[0].nsfw ? " (NSFW)" : ""}
					`}

					**Format:** ${message.anyUsage(
						`${commands[0].name}${
							commands[0].format ? ` ${commands[0].format}` : ""
						}`
					)}
				`;

				if (commands[0].aliases.length > 0)
					help += `\n**Aliases:** ${commands[0].aliases.join(", ")}`;
				help += `\n${oneLine`
					**Group:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
				if (commands[0].details)
					help += `\n**Details:** ${commands[0].details}`;
				if (commands[0].examples)
					help += `\n**Examples:**\n${commands[0].examples.join("\n")}`;
			} else if (commands.length > 15) {
				return message.reply(
					"Multiple commands found. Please be more specific."
				);
			}
		}

		const messages = [];

		try {
			const embed = new Discord.MessageEmbed()
				.setTitle("Help Command in progress")
				.setFooter("A Discord Terminal")
				.setDescription(
					`
					${oneLine`
						To run a command in ${message.guild ? message.guild.name : "any server"},
						use ${Command.usage(
							"command",
							message.guild ? message.guild.commandPrefix : null,
							this.client.user
						)}.
						For example, ${Command.usage(
							"prefix",
							message.guild ? message.guild.commandPrefix : null,
							this.client.user
						)}.
					`}
			
					Use ${this.usage(
						"<command>",
						null,
						null
					)} to view detailed information about a specific command.
					Use ${this.usage(
						"all",
						null,
						null
					)} to view a list of *all* commands, not just available ones.

					`
				)
				.addField(
					"Commands"
					// `${groups
					// 	.filter((grp) => {
					// 		grp.commands.some(
					// 			(cmd) => !cmd.hidden && (showAll || cmd.isUsable(message))
					// 		);
					// 	})
					// 	.map((grp) => {
					// 		stripIndents`
					// __${grp.name}__
					// ${grp.comannds
					// 	.filter((cmd) => !cmd.hidden && (showAll || cmd.isUsable(message)))
					// 	.map(
					// 		(cmd) =>
					// 			`**${cmd.name}:** ${cdescription}${cmd.nsfw ? " (NSFW)" : ""}`
					// 	)
					// 	.join("\n")}
					// `;
					// 	})
					// 	.join("\n")}`,
					// { split: true }
				)
				.setColor("#c28ada");
			messages.push(await message.channel.send(embed));
		} catch (error) {
			messages.push(
				await message.reply("There was an error sending the help comamnd.")
			);
			console.log(error);
		}
	}
};
