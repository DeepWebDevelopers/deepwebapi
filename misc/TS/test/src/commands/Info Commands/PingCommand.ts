import { Message } from 'discord.js';
import { RunFunction } from '../../interfaces/Command';

export const run: RunFunction = async (client, message) => {
	const msg: Message = await message.channel.send(
		client.embed({ description: 'Ping!' }, message)
	);
	await msg.edit(
		client.embed(
			{
				title: 'My Ping',
				description: `WebSocket: ${client.ws.ping}Ms\n Message Edit: ${
					msg.createdTimestamp - message.createdTimestamp
				}Ms`,
			},
			message
		)
	);
};

export const name: string = 'ping';
export const aliases: string[] = ['pong'];
export const category: string = 'info';
export const cooldown: number = 15;
