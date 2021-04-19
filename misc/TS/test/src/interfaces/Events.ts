import { Terminal } from '../client/client';

export interface RunFunction {
	(client: Terminal, ...args: any[]): Promise<unknown>;
}

export interface Event {
	name: string;
	run: RunFunction;
}
