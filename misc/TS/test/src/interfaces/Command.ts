import { Message } from 'discord.js';
import { Terminal } from '../client/client';

export interface RunFunction {
	(client: Terminal, message: Message, args: string[]): Promise<unknown>;
}

export interface Command {
	name: string;
	category: string;
	aliases?: string[];
	cooldown: number;
	run: RunFunction;
}
