import { Disclosure, Command, Arguments } from 'disclosure-discord';
import { Message, MessageEmbed, Client } from 'discord.js';

export default class extends Command {
	constructor(client: Disclosure) {
		super(client, {
			name: 'ping',
			description: 'Sends the bots api ping!',
			cooldown: 8,
			args: 0,
			usage: ['ping'],
			aliases: [],
			userPermissions: ['SEND_MESSAGES'],
			clientPermissions: ['SEND_MESSAGES'],
			ownerOnly: false,
			guildOnly: true,
		});
	}

	async execute(message: Message, argv: Arguments) {
		const msg: Message = await message.channel.send(
			new MessageEmbed().setDescription('Ping!')
		);
		await msg.edit(
			new MessageEmbed().setDescription(`${this.client.ws.ping}ms!`)
		);
	}
}
