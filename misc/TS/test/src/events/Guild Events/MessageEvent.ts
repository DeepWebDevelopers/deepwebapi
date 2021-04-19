import { Message } from 'discord.js';
import { Command } from '../../interfaces/Command';
import { RunFunction } from '../../interfaces/Events';
import ms from 'ms';
import { Config }from '../../interfaces/config'

export const run: RunFunction = async (client, message: Message) => {


	if (
		message.author.bot ||
		!message.guild ||
		!message.content.toLocaleLowerCase().startsWith('t!')
	)
		return;
	const args: string[] = message.content.slice('t!'.length).trim().split(/ +/g);
	const cmd: string = args.shift();

	const command: Command =
		client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
	if (!command) return;

	// cooldown system
	if (client.cooldowns.has(`${message.author.id}-${command.name}`))
		return await message.channel.send(
			client.embed(
				{
					description: `You can use this command in ${ms(
						client.cooldowns.get(`${message.author.id}-${command.name}`) -
							Date.now(),
						{ long: true }
					)}`,
				},
				message
			)
		);

	// message error handler
	command.run(client, message, args).catch((reason: any) => {
		message.channel.send(
			client.embed({ description: `An Error came: \`${reason}\`` }, message)
		);
		return client.logger.error(reason);
	});
	// removes cooldown after 'x' ammount of secs
	client.cooldowns.set(
		`${message.author.id}-${command.name}`,
		Date.now() + command.cooldown
	);
	setTimeout(() => {
		client.cooldowns.delete(`${message.author.id}-${command.name}`);
	}, command.cooldown);
};

export const name: string = 'message';
