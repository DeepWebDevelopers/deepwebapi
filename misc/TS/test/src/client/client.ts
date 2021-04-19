import consola, { Consola } from 'consola';
import {
	Client,
	MessageEmbedOptions,
	Message,
	Intents,
	Collection,
	MessageEmbed,
} from 'discord.js';
import glob from 'glob';
import { promisify } from 'util';

import { Command } from '../interfaces/Command';
import { Config } from '../interfaces/config';
import { Event } from '../interfaces/Events';

const globPromise = promisify(glob);

class Terminal extends Client {
	public logger: Consola = consola;
	public events: Collection<string, Event> = new Collection();
	public commands: Collection<string, Command> = new Collection();
	public aliases: Collection<string, string> = new Collection();
	public cooldowns: Collection<string, number> = new Collection();
	public categories: Set<string> = new Set();
	public description: Collection<string, string> = new Collection() // coming soon!
	public config: Config;
	public constructor() {
		super({
			ws: { intents: Intents.ALL },
			messageCacheLifetime: 180,
			messageCacheMaxSize: 200,
			messageEditHistoryMaxSize: 200,
		}); //  messageInterval: 180 - look up fix
	}
	public async start(config: Config): Promise<void> {
		this.config = config;
		this.login(config.TOKEN);
		const commandFiles: string[] = await globPromise(
			`${__dirname}/../commands/**/*{.ts,.js}`
		);
		// ! Command handler
		commandFiles.map(async (value: string) => {
			const file: Command = await import(value);
			// default cooldown if non is passed!
			this.commands.set(file.name, {
				cooldown: 3000,
				...file,
			});
			this.categories.add(file.category);
			if (file.aliases?.length) {
				file.aliases.map((value: string) => this.aliases.set(value, file.name));
			}
		});
		// ! Event handler
		const eventFiles: string[] = await globPromise(
			`${__dirname}/../events/**/*{.ts,.js}`
		);
		eventFiles.map(async (value: string) => {
			const file: Event = await import(value);
			this.events.set(file.name, file);
			this.on(file.name, file.run.bind(null, this));
		});
	}
	// ! Embed Handler
	public embed(options: MessageEmbedOptions, message: Message): MessageEmbed {
		return new MessageEmbed({ ...options, color: 'RANDOM' }).setFooter(
			`${message.author.tag} | Thanks for using ${this.user.username}!`,
			message.author.displayAvatarURL({ format: 'png', dynamic: true })
		);
	}
}

export { Terminal };
